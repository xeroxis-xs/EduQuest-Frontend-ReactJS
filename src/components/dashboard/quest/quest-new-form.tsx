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
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import Typography from "@mui/material/Typography";
import {AxiosError} from "axios";
import type {AxiosResponse} from "axios";
import Select, { type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import type { Course } from "@/types/course";
import type { Quest } from "@/types/quest";
import { useUser } from "@/hooks/use-user";
import { FilePlus as FilePlusIcon } from '@phosphor-icons/react/dist/ssr/FilePlus';
import {CardMedia, TextField} from "@mui/material";
import type {Image} from "@/types/image";
import Chip from "@mui/material/Chip";
import FormLabel from "@mui/material/FormLabel";
import {useTheme} from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Stack from "@mui/material/Stack";

interface CourseFormProps {
  onFormSubmitSuccess: () => void;
  courseId: number | null;
}

export function QuestNewForm({onFormSubmitSuccess, courseId}: CourseFormProps): React.JSX.Element {
  const { eduquestUser} = useUser();
  const theme = useTheme();
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questExpirationDateRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const questImageIdRef = React.useRef<HTMLInputElement>(null);
  const [courses, setCourses] = React.useState<Course[]>();
  const [images, setImages] = React.useState<Image[]>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const getImages = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Image[]> = await apiService.get<Image[]>(`/api/Image/`);
      const data: Image[] = response.data;
      setImages(data);
      logger.debug('Images', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>(`/api/Course/`);
      const data: Course[] = response.data;
      const filteredData = data.filter((course) => course.type !== 'Private');
      if (courseId) {
        // If courseId is provided, filter the data to only show the selected course
        // This will be set to disabled and selected by default
        const course = data.find(c => c.id === courseId);
        if (course) {
          setCourses([course]);
        }
      } else {
        // If courseId is not provided, show all courses
        setCourses(filteredData);
      }
      logger.debug('Filtered Courses', filteredData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      logger.error('Failed to fetch data', error);
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
    const newQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      from_course: selectedCourse || courses?.[0],
      organiser: eduquestUser,
      image: selectedImage || images?.[0]
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.post(`/api/Quest/`, newQuest);
      onFormSubmitSuccess();
      logger.debug('New Quest has been created successfully:', response.data);
      setSubmitStatus({type: 'success', message: 'Create Successful'});
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
      }
      setSubmitStatus({ type: 'error', message: 'Create Failed. Please try again.' });
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourses();
      await getImages();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add new quest to the system" title="New Quest" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="quest name">Quest Name</FormLabel>
                <TextField
                  inputRef={questNameRef}
                  placeholder="The name of the quest"
                  variant='outlined'
                  size='small'
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="quest expiry date">Quest Expiry Date</FormLabel>
                <TextField
                  inputRef={questExpirationDateRef}
                  type="datetime-local"
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
                <Select defaultValue="Eduquest MCQ" label="Quest Type" inputRef={questTypeRef} name="type" size="small">
                  <MenuItem value="Eduquest MCQ"><Chip variant="outlined" label="Eduquest MCQ" color="primary" size="small"/></MenuItem>
                  <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                  <MenuItem value="Kahoot!"><Chip variant="outlined" label="Kahoot!" color="violet" size="small"/></MenuItem>
                  <MenuItem value="Wooclap"><Chip variant="outlined" label="Wooclap" color="neon" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="quest status">Quest Status</FormLabel>
                <Select defaultValue="Active" label="Quest Status" inputRef={questStatusRef} name="status" size="small">
                  <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                  <MenuItem value="Expired"><Chip variant="outlined" label="Expired" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="quest description">Quest Description</FormLabel>
                <TextField
                  inputRef={questDescriptionRef}
                  placeholder="The description of the quest"
                  variant='outlined'
                  multiline
                  size="medium"
                  rows={3}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Typography sx={{my:3}} variant="h6">Thumbnail</Typography>
          {images ?
            <Grid container spacing={3} >
              <Grid container md={6} xs={12} alignItems="flex-start">
                <Grid xs={12}>
                  <FormControl required >
                    <FormLabel htmlFor="quest image">Thumbnail ID</FormLabel>
                    <Select
                      defaultValue={images[0]?.id}
                      onChange={handleImageChange}
                      inputRef={questImageIdRef}
                      variant="outlined"
                      type="number"
                      label="Thumbnail ID"
                      size="small"
                    >
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
                <Grid xs={12}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
                  <CardMedia
                    component="img"
                    alt={selectedImage?.name || images[0].name}
                    image={`/assets/${selectedImage?.filename || images[0].filename}`}
                    sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Grid> : null}
          <Divider sx={{my:3}}/>

          <Typography sx={{my:3}} variant="h6">Associated Course</Typography>

          {courses ?
            <Grid container spacing={3} >
              <Grid container md={6} xs={12} alignItems="flex-start">
                <Grid xs={12}>
                  <FormControl required>
                    <FormLabel htmlFor="course id">Course ID</FormLabel>
                    <Select defaultValue={courses[0]?.id} onChange={handleCourseChange} inputRef={questCourseIdRef}
                            label="Course ID" variant="outlined" type="number" disabled={Boolean(courseId)} size="small">
                      {courses.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id} - [{option.group}] {option.code} {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Code</Typography>
                  <Typography variant="body2">{selectedCourse?.code || courses[0]?.code}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Name</Typography>
                  <Typography variant="body2">{selectedCourse?.name || courses[0]?.name }</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Group</Typography>
                  <Typography variant="body2">{selectedCourse?.group || courses[0]?.group}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Type</Typography>
                  <Typography variant="body2">{selectedCourse?.type || courses[0]?.type }</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Status</Typography>
                  <Typography variant="body2">{selectedCourse?.status || courses[0]?.status}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Year / Term</Typography>
                  <Typography variant="body2">
                    AY {selectedCourse?.term?.academic_year.start_year || courses[0]?.term?.academic_year.start_year}-{selectedCourse?.term?.academic_year.end_year || courses[0].term?.academic_year.end_year} / {selectedCourse?.term?.name || courses[0].term.name}
                  </Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Duration</Typography>
                  <Typography variant="body2">
                    From {selectedCourse?.term?.start_date || courses[0]?.term?.start_date} to {selectedCourse?.term?.end_date || courses[0].term?.end_date}
                  </Typography>
                </Grid>

                <Grid xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Description</Typography>
                  <Typography variant="body2">{selectedCourse?.description || courses[0]?.description}</Typography>
                </Grid>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Thumbnail</Typography>
                <CardMedia
                  component="img"
                  alt={selectedCourse?.image.name || courses[0]?.image.name}
                  image={`/assets/${selectedCourse?.image.filename || courses[0]?.image.filename}`}
                  sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
                />
              </Grid>





            </Grid> : null}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button startIcon={<FilePlusIcon fontSize="var(--icon-fontSize-md)"/>} type="submit" variant="contained">Add</Button>
        </CardActions>

      </Card>
      {submitStatus ? <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert> : null}

    </form>
  );
}
