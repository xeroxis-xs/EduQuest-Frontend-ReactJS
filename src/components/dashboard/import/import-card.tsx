import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from "@mui/material/CardHeader";
import { CardMedia, TextField, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {CaretRight as CaretRightIcon} from "@phosphor-icons/react/dist/ssr/CaretRight";
import { FileXls as FileXlsIcon } from "@phosphor-icons/react/dist/ssr/FileXls";
import {AxiosError, type AxiosResponse} from "axios";
import type {Course} from "@/types/course";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {authClient} from "@/lib/auth/client";
import type {Image} from "@/types/image";
import type {Question} from "@/types/question";
import {styled, useTheme} from "@mui/material/styles";
import {useUser} from "@/hooks/use-user";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import {Loading} from "@/components/dashboard/loading/loading";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImportCardProps {
  onImportSuccess: (questions : Question[]) => void;
  courseId: string | null;
}


export function ImportCard({ onImportSuccess, courseId }: ImportCardProps): React.JSX.Element {
  const { eduquestUser} = useUser();
  const theme = useTheme();
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questTutorialDateRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const questImageIdRef = React.useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = React.useState(true);
  const [isImagesLoading, setIsImagesLoading] = React.useState(true);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [images, setImages] = React.useState<Image[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState< { type: 'success' | 'error'; message: unknown } | null>(null);


  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>('/api/Course/non-private');
      const data: Course[] = response.data;
      if (courseId) {
        const course = data.find(c => c.id === Number(courseId));
        if (course) {
          setCourses([course]);
        }
      } else {
        setCourses(data);
      }
      logger.debug('Filtered Courses', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setIsCoursesLoading(false);
    }
  }


  const getImages = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Image[]> = await apiService.get<Image[]>('/api/Image/');
      const data: Image[] = response.data;
      setImages(data);
      logger.debug('Images', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setIsImagesLoading(false);
    }
  }



  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    setSelectedFile(file);
    logger.debug('Dropped File:', file);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    logger.debug('Selected File:', file);
  };


  const handleImageChange = (event: SelectChangeEvent<number>): void => {
    const imageId = Number(event.target.value); // Convert the value to a number
    const image = images?.find(i => i.id === imageId);
    if (image) {
      setSelectedImage({
        id: image.id,
        name: image.name,
        filename: image.filename
      });
    }
  };

  const handleCourseChange = (event: SelectChangeEvent<number>): void => {
    const cId = Number(event.target.value); // Convert the value to a number
    const course = courses?.find(c => c.id === cId);
    if (course) {
      setSelectedCourse({
        id: course.id,
        code: course.code,
        group: course.group,
        name: course.name,
        description: course.description,
        status: course.status,
        type: course.type,
        term: {
          id: course.term.id,
          name: course.term.name,
          start_date: course.term.start_date,
          end_date: course.term.end_date,
          academic_year: {
            id: course.term.academic_year.id,
            start_year: course.term.academic_year.start_year,
            end_year: course.term.academic_year.end_year
          }
        },
        image: {
          id: course.image.id,
          name: course.image.name,
          filename: course.image.filename
        },
        enrolled_users: course.enrolled_users
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsProcessing(true);
    const tutorialDate = questTutorialDateRef.current?.value
        ? new Date(questTutorialDateRef.current.value).toISOString()
        : null;
    // Create FormData
    const formData = new FormData();
    // Append other data as needed
    formData.append('type', questTypeRef.current?.value || '');
    formData.append('name', questNameRef.current?.value || '');
    formData.append('description', questDescriptionRef.current?.value || '');
    formData.append('tutorial_date', tutorialDate || '');
    formData.append('status', 'Active');
    formData.append('max_attempts', '1');
    // Assuming selectedCourse and selectedImage are objects, you might need to stringify them or just append their IDs
    formData.append('from_course', JSON.stringify(selectedCourse || courses?.[0]));
    formData.append('organiser', JSON.stringify(eduquestUser));
    formData.append('image', JSON.stringify(selectedImage || images?.[0]));

    if (selectedFile) {
      formData.append('file', selectedFile);

      try {
        const response: AxiosResponse<Question[]> = await apiService.post(`/api/Quest/import/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        logger.debug('Upload Success, Question data: ', response.data);
        setSubmitStatus({ type: 'success', message: 'Quest Import Successful' });
        onImportSuccess(response.data);
      }
      catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
          else {
            logger.error('Code: ', error.response?.status);
            logger.error('Message: ', error.response?.data);
          }
          setSubmitStatus({ type: 'error', message: JSON.stringify(error.response?.data) });
        }
      }
    }
    else {
      logger.error('No file selected');
      setSubmitStatus({ type: 'error', message: 'No file selected' });
    }
    setIsProcessing(false);

  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getImages();
      await getCourses();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  // React.useEffect(() => {
  //   console.log('isCoursesLoading', isCoursesLoading);
  // }, [isCoursesLoading]);

  return (
    <form onSubmit={handleSubmit}>
      <Card
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        sx={{
          border: isDragging ? '2px dashed var(--mui-palette-primary-main)' : '1px solid var(--mui-palette-neutral-200)',
          backgroundColor: isDragging ? 'var(--mui-palette-background-level2)' : 'var(--mui-palette-background-paper)',
          transition: 'background-color, border '
        }}
      >
      <CardHeader title="New Quest Import" subheader="Create a new quest for this import"/>
      <Divider/>

      <CardContent sx={{pb:'16px'}}>

        <Grid container spacing={3}>

          <Grid md={6} xs={12}>
            <FormControl fullWidth required>
              <FormLabel htmlFor="quest name">Quest Name</FormLabel>
              <TextField
                inputRef={questNameRef}
                placeholder="The name of the quest. E.g. 'Week 1 Quiz' or 'Lecture 1 MCQ'"
                variant='outlined'
                size='small'
              />
            </FormControl>
          </Grid>
          <Grid md={6} xs={12}>
            <FormControl fullWidth required>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                <FormLabel htmlFor="quest type">Quest Type</FormLabel>
                <Tooltip title={
                  <Typography variant="inherit">
                    <strong>Eduquest MCQ</strong> Quest developed from EduQuest<br />
                    <strong>Wooclap:</strong> Quest imported from Wooclap<br />
                    <strong>Kahoot!:</strong> Quest imported from Kahoot!<br />
                    <strong>Private:</strong> Quest for personal quest generation use only
                  </Typography>
                } placement="top">
                  <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginBottom: '8px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>
              <Select defaultValue="Wooclap" label="Quest Type" inputRef={questTypeRef} name="type" size="small">
                <MenuItem value="Eduquest MCQ"><Chip variant="outlined" label="Eduquest MCQ" color="primary" size="small"/></MenuItem>
                <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                <MenuItem value="Kahoot!"><Chip variant="outlined" label="Kahoot!" color="violet" size="small"/></MenuItem>
                <MenuItem value="Wooclap"><Chip variant="outlined" label="Wooclap" color="neon" size="small"/></MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid md={6} xs={12}>
            <FormControl fullWidth required>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                <FormLabel htmlFor="quest tutorial date">Quest Tutorial Date</FormLabel>
                <Tooltip title="The date and time of the tutorial session conducted" placement="right">
                  <InfoIcon style={{ marginBottom: '8px',cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>
              <TextField
                inputRef={questTutorialDateRef}
                type="datetime-local"
                variant='outlined'
                size='small'
              />
            </FormControl>
          </Grid>

          <Grid md={6} xs={12}>
            <FormControl fullWidth required>
              <FormLabel htmlFor="select file">External Report</FormLabel>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  startIcon={<FileXlsIcon />}
                  sx={{ height: '100%' }}
                >
                  {selectedFile ? selectedFile.name : 'Select File or Drag and Drop'}
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
            </FormControl>
          </Grid>


          <Grid xs={12}>
            <FormControl fullWidth required>
              <FormLabel htmlFor="quest description">Quest Description</FormLabel>
              <TextField
                inputRef={questDescriptionRef}
                placeholder="The description of the quest. E.g. 'This quest is for tutorial 1 conducted on week 3.'"
                variant='outlined'
                multiline
                rows={3}
              />

            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

    <Card sx={{mt: 6}}>
      <CardHeader title="Quest Thumbnail" subheader="Select a thumbnail for this quest"/>
      <Divider/>
      <CardContent sx={{pb:'16px'}}>
        {isImagesLoading ? <Skeleton variant="rectangular" height={160} width='100%'/>
          : images.length > 0 ?
          <Grid container spacing={3} >
            <Grid container md={6} xs={12} alignItems="flex-start">
              <Grid xs={12}>
                <FormControl  required>
                  <FormLabel htmlFor="thumbnail id">Thumbnail ID</FormLabel>
                  <Select defaultValue={images[0]?.id} onChange={handleImageChange} inputRef={questImageIdRef}
                          label="Thumbnail ID" variant="outlined" type="number" size="small">
                    {images.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id} - {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Thumbnail Name</Typography>
                <Typography variant="body2">{selectedImage?.name || images[0].name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                <Typography variant="body2">{selectedImage?.filename || images[0].filename}</Typography>
              </Grid>
            </Grid>

            <Grid md={6} xs={12}>
              <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
              <CardMedia
                component="img"
                alt={selectedImage?.name || images[0].name}
                image={`/assets/${selectedImage?.filename || images[0].filename}`}
                sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
              />
            </Grid>
          </Grid> : null}
      </CardContent>
    </Card>

      <Card sx={{mt: 6}}>
        <CardHeader title="Associated Course" subheader="Select an associated course for this quest"/>
        <Divider/>
        <CardContent sx={{pb:'16px'}}>
          {isCoursesLoading ? <Skeleton variant="rectangular" height={160} width='100%'/>
            : courses.length > 0 ?
            <Grid container spacing={3} >
              <Grid container md={6} xs={12} alignItems="flex-start">
                <Grid md={6} xs={12}>
                  <FormControl required>
                    <FormLabel htmlFor="course id">Course Group - Course Name</FormLabel>
                    <Select defaultValue={courses[0]?.id} onChange={handleCourseChange} inputRef={questCourseIdRef}
                            label="Course Group - Course Name" variant="outlined" type="number" size="small"
                            disabled={Boolean(courseId)}>
                      {courses.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id} - [{option.group}] {option.code} {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>

                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Code</Typography>
                  <Typography variant="body2">{selectedCourse?.code || courses[0].code}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Name</Typography>
                  <Typography variant="body2">{selectedCourse?.name || courses[0].name }</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Group</Typography>
                  <Typography variant="body2">{selectedCourse?.group || courses[0].group}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Year / Term</Typography>
                  <Typography variant="body2">
                    AY {selectedCourse?.term.academic_year.start_year || courses[0].term.academic_year.start_year}-{selectedCourse?.term.academic_year.end_year || courses[0].term.academic_year.end_year} / {selectedCourse?.term.name || courses[0].term.name}
                  </Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Duration</Typography>
                  <Typography variant="body2">
                    From {selectedCourse?.term.start_date || courses[0].term.start_date} to {selectedCourse?.term.end_date || courses[0].term.end_date}
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Description</Typography>
                  <Typography variant="body2">{selectedCourse?.description || courses[0].description}</Typography>
                </Grid>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Thumbnail</Typography>
                <CardMedia
                  component="img"
                  alt={selectedCourse?.image.name || courses[0].image.name}
                  image={`/assets/${selectedCourse?.image.filename || courses[0].image.filename}`}
                  sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
                />
              </Grid>
            </Grid> : null}


      </CardContent>
    </Card>

      {submitStatus ?
        <Alert severity={submitStatus.type} sx={{ mt: 4 }}>
          {String(submitStatus.message)}
        </Alert> : null}

      {isProcessing ? <Loading text="Creating Quest and Questions..." /> : null}

    <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
      <Button endIcon={<CaretRightIcon/>} type="submit" variant="contained">Next: Edit Question</Button>
    </Box>

    </form>

  );
}
