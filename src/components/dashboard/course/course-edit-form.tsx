"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import type { Course } from "@/types/course";
import type {Term} from "@/types/term";
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import Typography from "@mui/material/Typography";
import {AxiosError} from "axios";
import type {AxiosResponse} from "axios";
import Select, { type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type {Image} from "@/types/image";
import {CardMedia, TextField} from "@mui/material";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import {Trash as TrashIcon} from "@phosphor-icons/react/dist/ssr/Trash";
import {FloppyDisk as FloppyDiskIcon} from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import {useUser} from "@/hooks/use-user";
import {paths} from "@/paths";
import {useRouter} from "next/navigation";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";
import {useTheme} from "@mui/material/styles";


interface CourseFormProps {
  setSubmitStatus: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
  course: Course;
  toggleForm: () => void;
  onUpdateSuccess: () => void;
}

export function CourseEditForm({ setSubmitStatus, course, toggleForm, onUpdateSuccess }: CourseFormProps): React.JSX.Element {
  const router = useRouter();
  const { eduquestUser } = useUser();
  const theme = useTheme();
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseGroupRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTypeRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const courseImageIdRef = React.useRef<HTMLInputElement>(null);
  const [terms, setTerms] = React.useState<Term[]>();
  const [images, setImages] = React.useState<Image[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [loadingTerms, setLoadingTerms] = React.useState(true);

  const getTerms = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Term[]> = await apiService.get<Term[]>(`/api/Term/`);
      const data: Term[] = response.data;
      const filteredData = data.filter((term) => term.name !== 'Private Term' && term.academic_year.start_year !== 0);
      setTerms(filteredData);
      logger.debug('Filtered Terms:', filteredData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    } finally {
      setLoadingTerms(false);
    }
  };

  const getImages = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Image[]> = await apiService.get<Image[]>(`/api/Image/`);
      const data: Image[] = response.data;
      setImages(data);
      logger.debug('images', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleTermChange = (event: SelectChangeEvent<number>): void => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const termId = Number(event.target.value); // Convert the value to a number
    const term = terms?.find(t => t.id === termId);
    if (term) {
      setSelectedTerm({
        id: term.id,
        name: term.name,
        start_date: term.start_date,
        end_date: term.end_date,
        academic_year: {
          id: term.academic_year.id,
          start_year: term.academic_year.start_year,
          end_year: term.academic_year.end_year
        }
      });
    }
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


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const updatedCourse = {
      code: courseCodeRef.current?.value,
      name: courseNameRef.current?.value,
      group: courseGroupRef.current?.value,
      description: courseDescriptionRef.current?.value,
      status: courseStatusRef.current?.value,
      term: selectedTerm || course?.term,
      image: selectedImage || course?.image
    };

    try {
      const response: AxiosResponse<Course> = await apiService.patch(`/api/Course/${course.id.toString()}/`, updatedCourse);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      toggleForm();
      onUpdateSuccess();
    } catch (error) {
      logger.error('Submit Error:', error);
      setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });
    }
  };

  const handleDeleteCourse = async (): Promise<void> => {
    try {
      await apiService.delete(`/api/Course/${course.id.toString()}`);

      router.push(paths.dashboard.course.all);
    } catch (error) {
      logger.error('Failed to delete the course', error);
      setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getTerms();
      await getImages();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Edit Course Details"
          subheader={`ID: ${course.id.toString()}`}
          action={
            eduquestUser?.is_staff ?
              <Stack direction="row" spacing={1} sx={{alignItems: 'center'}} color="error">
                <Button startIcon={<XCircleIcon fontSize="var(--icon-fontSize-md)" />} onClick={toggleForm} color="error">
                  Cancel
                </Button>
              </Stack> : null
          }
        />
        <Divider/>

        <CardContent>

          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course code">Course Code</FormLabel>
                <TextField
                  defaultValue={course.code}
                  placeholder="The code of the course"
                  variant='outlined'
                  size='small'
                  inputRef={courseCodeRef}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course name">Course Name</FormLabel>
                <TextField
                  defaultValue={course.name}
                  placeholder="The name of the course"
                  variant='outlined'
                  size='small'
                  inputRef={courseNameRef}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course group">Course Group</FormLabel>
                <TextField
                  defaultValue={course.group}
                  placeholder="The student group / session of the course"
                  variant='outlined'
                  size='small'
                  inputRef={courseGroupRef}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course type">Course Type</FormLabel>
                <Select defaultValue={course.type} label="Type" inputRef={courseTypeRef} name="type" size="small">
                  <MenuItem value="Public"><Chip variant="outlined" label="Public" color="primary" size="small"/></MenuItem>
                  <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course status">Course Status</FormLabel>
                <Select defaultValue={course.status} label="Status" inputRef={courseStatusRef} name="status" size="small">
                  <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                  <MenuItem value="Expired"><Chip variant="outlined" label="Expired" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course description">Course Description</FormLabel>
                <TextField
                  inputRef={courseDescriptionRef}
                  defaultValue={course.description}
                  placeholder="The description of the course"
                  variant='outlined'
                  multiline
                  size="medium"
                  rows={3}
                />
              </FormControl>
            </Grid>

          </Grid>

          <Divider sx={{my: 4}}/>

          <Typography sx={{my: 3}} variant="h6">Term</Typography>
          {loadingTerms ? <Skeleton variant="rectangular" height={100}  />
            : terms ?
            <Grid container spacing={3}>

            <Grid md={6} xs={12}>
              <FormControl required>
                <FormLabel htmlFor="term id">Term ID</FormLabel>
                <Select defaultValue={course.term.id} onChange={handleTermChange} inputRef={courseTermIdRef}
                        label="Term ID" variant="outlined" type="number" size="small">
                  {terms.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.id} - AY{option.academic_year.start_year}-{option.academic_year.end_year} {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
            <Grid md={3} xs={6}>
              <Typography variant="overline" color="text.secondary">Term Name</Typography>
              <Typography variant="body2">{selectedTerm?.name || course.term.name}</Typography>
            </Grid>
            <Grid md={3} xs={6}>
              <Typography variant="overline" color="text.secondary">Term Start Date</Typography>
              <Typography variant="body2">{selectedTerm?.start_date || course.term.start_date}</Typography>

            </Grid>
            <Grid md={3} xs={6}>
              <Typography variant="overline" color="text.secondary">Term End Date</Typography>
              <Typography variant="body2">{selectedTerm?.end_date || course.term.end_date}</Typography>

            </Grid>
            <Grid md={3} xs={6}>
              <Typography variant="overline" color="text.secondary">Academic Year ID</Typography>
              <Typography variant="body2">{selectedTerm?.academic_year.id || course.term.academic_year.id}</Typography>
            </Grid>
            <Grid md={3} xs={6}>
              <Typography variant="overline" color="text.secondary">Academic Year</Typography>
              <Typography variant="body2">AY {selectedTerm?.academic_year.start_year || course.term.academic_year.start_year}-{selectedTerm?.academic_year.end_year || terms[0].academic_year.end_year}</Typography>
            </Grid>
          </Grid> : null}

          <Divider sx={{my: 4}}/>

          <Typography sx={{my: 3}} variant="h6">Thumbnail</Typography>

          {loadingImages ? <Skeleton variant="rectangular" height={100}  />
            : images ?
            <Grid container spacing={3} >
              <Grid container md={6} xs={12} alignItems="flex-start">
                <Grid xs={12}>

                  <FormControl required>
                    <FormLabel htmlFor="image id">Thumbnail ID</FormLabel>
                    <Select defaultValue={course.image.id} onChange={handleImageChange} inputRef={courseImageIdRef}
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
                  <Typography variant="body2">{selectedImage?.name || course.image.name}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {selectedImage?.filename || course.image.filename}
                  </Typography>
                </Grid>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
                <CardMedia
                  component="img"
                  alt={selectedImage?.name || images[0].name}
                  image={`/assets/${selectedImage?.filename || course.image.filename}`}
                  sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}

                />
              </Grid>
            </Grid> : null}
        </CardContent>

        <CardActions sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteCourse}>Delete Course</Button>
          <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Course</Button>
        </CardActions>
      </Card>

    </form>
  );
}
