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
import {logger} from "@/lib/default-logger";
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
import {getImages} from "@/api/services/image";
import {getCourseGroup, getNonPrivateCourseGroups} from "@/api/services/course-group";
import {type CourseGroup} from "@/types/course-group";
import {importQuest} from "@/api/services/quest";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";



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
  courseGroupId: string | null;
}


export function ImportCard({ onImportSuccess, courseGroupId }: ImportCardProps): React.JSX.Element {
  const { eduquestUser} = useUser();
  const theme = useTheme();

  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questTutorialDateRef = React.useRef<HTMLInputElement>(null);
  const questImageIdRef = React.useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isCourseGroupsLoading, setIsCourseGroupsLoading] = React.useState(true);
  const [isImagesLoading, setIsImagesLoading] = React.useState(true);
  const [isDragging, setIsDragging] = React.useState(false);

  const [courseGroups, setCourseGroups] = React.useState<CourseGroup[]>([]);
  const [images, setImages] = React.useState<Image[]>([]);

  const [selectedCourseGroup, setSelectedCourseGroup] = React.useState<CourseGroup | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState< { type: 'success' | 'error'; message: unknown } | null>(null);


  const fetchImages = async (): Promise<void> => {
    try {
      const response = await getImages();
      setImages(response);
    } catch (error: unknown) {
      logger.error('Failed to fetch images', error);
    } finally {
      setIsImagesLoading(false);
    }
  }

  const fetchCourseGroups = async (): Promise<void> => {
    try {
      if (courseGroupId) {
        // If courseGroupId is provided, filter the data to only show the selected group
        // This will be set to disabled and selected by default
        const response = await getCourseGroup(courseGroupId);
        setCourseGroups([response]);
      } else {
        const response = await getNonPrivateCourseGroups();
        setCourseGroups(response);
      }
    } catch (error: unknown) {
      logger.error('Failed to fetch course groups', error);
    } finally {
      setIsCourseGroupsLoading(false);
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
    // logger.debug('Dropped File:', file);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    // logger.debug('Selected File:', file);
  };

  // Handle Image Change
  const handleImageChange = (event: SelectChangeEvent<number>): void => {
    const imageId = Number(event.target.value);
    const image = images?.find(i => i.id === imageId) || null;
    setSelectedImage(image);
  };

  // Handle Course Change
  const handleCourseChange = (event: SelectChangeEvent<number>): void => {
    const cId = Number(event.target.value);
    const course = courseGroups?.find(c => c.id === cId) || null;
    setSelectedCourseGroup(course);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsProcessing(true);
    // Create FormData
    const formData = new FormData();

    if (
      selectedCourseGroup &&
      eduquestUser &&
      selectedImage &&
      questTypeRef.current &&
      questNameRef.current &&
      questDescriptionRef.current &&
      questTutorialDateRef.current
    ) {
      // Append other data as needed
      formData.append('type', questTypeRef.current?.value || '');
      formData.append('name', questNameRef.current?.value || '');
      formData.append('description', questDescriptionRef.current?.value || '');
      formData.append('tutorial_date', new Date(questTutorialDateRef.current.value).toISOString());
      formData.append('status', 'Active');
      formData.append('max_attempts', '1');
      formData.append('course_group_id', selectedCourseGroup.id.toString() );
      formData.append('organiser_id', eduquestUser.id.toString() );
      formData.append('image_id', selectedImage.id.toString() );
    } else {
      logger.error('Missing required fields');
      setSubmitStatus({ type: 'error', message: 'Missing required fields' });
      setIsProcessing(false);
      return
    }

    if (selectedFile) {
      try {
        formData.append('file', selectedFile);

        // logger.debug('Form Data:', Array.from(formData.entries()));
        const response = await importQuest(formData);
        logger.debug('Upload Success, Question data: ', response);
        setSubmitStatus({type: 'success', message: 'Quest Import Successful'});
        onImportSuccess(response);
      } catch (error: unknown) {
        logger.error('Failed to import quest', error);
        setSubmitStatus({type: 'error', message: 'Failed to import quest'});
      } finally {
        setIsProcessing(false);
      }
    } else {
      logger.error('No file selected');
      setSubmitStatus({type: 'error', message: 'No file selected'});
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchImages();
      await fetchCourseGroups();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  // Pre-select the first image
  React.useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  // Pre-select the first course group
  React.useEffect(() => {
    if (courseGroups && courseGroups.length > 0) {
      setSelectedCourseGroup(courseGroups[0]);
    }
  }, [courseGroups]);

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
                <Typography variant="body2">{selectedImage?.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                <Typography variant="body2">{selectedImage?.filename}</Typography>
              </Grid>
            </Grid>

            <Grid md={6} xs={12}>
              <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
              <CardMedia
                component="img"
                alt={selectedImage?.name}
                image={`/assets/${selectedImage?.filename || images[0].filename}`}
                sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
              />
            </Grid>
          </Grid> : null}
      </CardContent>
    </Card>

      <Card sx={{mt: 6}}>
        <CardHeader title="Associated Course Group" subheader="Select an associated course group for this quest"/>
        <Divider/>
        <CardContent sx={{pb:'16px'}}>
          {isCourseGroupsLoading ? <Skeleton variant="rectangular" height={50}/>
            : courseGroups ?
              <Grid container spacing={3} >
                <Grid container xs={12} alignItems="flex-start">
                  <Grid xs={12}>
                    <FormControl required>
                      <FormLabel htmlFor="course id">Group ID</FormLabel>
                      <Select defaultValue={courseGroups[0]?.id} onChange={handleCourseChange}
                              label="Course ID" variant="outlined" type="number" disabled={Boolean(courseGroupId)} size="small">
                        {courseGroups.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {`${option.id.toString()} - [${option.name}] ${option.course.code} ${option.course.name}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid md={3} xs={12}>
                    <Typography variant="overline" color="text.secondary">Group Name</Typography>
                    <Typography variant="body2">{selectedCourseGroup?.name}</Typography>
                  </Grid>
                  <Grid md={3} xs={12}>
                    <Typography variant="overline" color="text.secondary">Group Session Day</Typography>
                    <Typography variant="body2">{selectedCourseGroup?.session_day}</Typography>
                  </Grid>
                  <Grid md={3} xs={12}>
                    <Typography variant="overline" color="text.secondary">Group Session Time</Typography>
                    <Typography variant="body2">{selectedCourseGroup?.session_time}</Typography>
                  </Grid>
                  <Grid md={3} xs={12}>
                    <Typography variant="overline" color="text.secondary">Instructor</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <UserIcon size={18}/>
                      <Typography variant="body2">{selectedCourseGroup?.instructor.nickname}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid> : null}

      </CardContent>
    </Card>

      {submitStatus ?
        <Alert severity={submitStatus.type} sx={{ mt: 4 }}>
          {String(submitStatus.message)}
        </Alert> : null}

      {isProcessing ? <Loading text="Processing File..." /> : null}

    <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
      <Button endIcon={<CaretRightIcon/>} type="submit" variant="contained">Next: Edit Question</Button>
    </Box>

    </form>

  );
}
