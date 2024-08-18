"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import type { Course } from '@/types/course';
import type { Term } from '@/types/term';
import type { Quest } from '@/types/quest';
import apiService from "@/api/api-service";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import RouterLink from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import Chip from "@mui/material/Chip";
import {QuestCard} from "@/components/dashboard/quest/quest-card";
import {useUser} from "@/hooks/use-user";
import {CardMedia, TextField} from "@mui/material";
import {Check as CheckIcon} from "@phosphor-icons/react/dist/ssr/Check";
import {SignIn as SignInIcon} from "@phosphor-icons/react/dist/ssr/SignIn";
import Box from "@mui/material/Box";
import {Users as UsersIcon} from "@phosphor-icons/react/dist/ssr/Users";
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import {type Image} from "@/types/image";
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import { SkeletonCourseDetailCard } from "@/components/dashboard/skeleton/skeleton-course-detail-card";


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line no-unused-vars -- expand is defined in props
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function Page({ params }: { params: { courseId: string } }) : React.JSX.Element {
  const router = useRouter();
  const { eduquestUser } = useUser();
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTypeRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const courseImageIdRef = React.useRef<HTMLInputElement>(null);
  const [course, setCourse] = React.useState<Course>();
  const [terms, setTerms] = React.useState<Term[]>();
  const [quests, setQuests] = React.useState<Quest[]>();
  const [images, setImages] = React.useState<Image[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingQuests, setLoadingQuests] = React.useState(true);
  const [loadingCourse, setLoadingCourse] = React.useState(true);

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };


  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getCourse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course> = await apiService.get<Course>(`/api/Course/${params.courseId}`);
      const data: Course = response.data;
      setCourse(data);
      // setUserCourse(data.enrolled_users.find(user => user.user === eduquestUser?.id.toString()));
      logger.debug('course', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    } finally {
      setLoadingCourse(false);
    }
  };


  const getTerms = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Term[]> = await apiService.get<Term[]>(`/api/Term/`);
      const data: Term[] = response.data;
      setTerms(data);
      logger.debug('terms', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getQuests = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Quest[]> = await apiService.get<Quest[]>(`/api/Quest/by-course/${params.courseId}`);
      const data: Quest[] = response.data;
      setQuests(data);
      logger.debug('quests', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    } finally {
      setLoadingQuests(false);
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
      description: courseDescriptionRef.current?.value,
      status: courseStatusRef.current?.value,
      term: selectedTerm || course?.term,
      image: selectedImage || course?.image
    };

    try {
      const response: AxiosResponse<Course> = await apiService.patch(`/api/Course/${params.courseId}/`, updatedCourse);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      await getCourse();
      setShowForm(false)
    } catch (error) {
      logger.error('Submit Error:', error);
      setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });

    }

  };

  const handleDeleteCourse = async (): Promise<void> => {
    try {
      await apiService.delete(`/api/Course/${params.courseId}`);

      router.push(paths.dashboard.course.all);
    } catch (error) {
      logger.error('Failed to delete the course', error);
      setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
    }
  };

  const handleEnroll = async (): Promise<void> => {
    try {
      const data = {
        user: {
          id: eduquestUser?.id
        },
        course: {
          id: params.courseId
        }
      }
      const response = await apiService.post(`/api/UserCourse/`, data);
      if (response.status === 201) {
        logger.debug('Enrolled successfully');
        await getCourse();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error enrolling: ', error);
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourse();
      await getTerms();
      await getImages();
      await getQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  });


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>
        <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={paths.dashboard.course.all}>View all Courses</Button>
        {eduquestUser?.is_staff ?
          <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
            {showForm ? 'Close' : 'Edit Course'}
          </Button> : null}
      </Stack>

      {!showForm && (
        loadingCourse ? (
          <SkeletonCourseDetailCard />
        ) : (
          course ? (
        <Card>
          <CardHeader title="Course Details" subheader={`ID: ${course.id.toString()}`}/>
          <CardMedia
            component="img"
            alt="cloud computing"
            image={`/assets/${course.image.filename}`}
            sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
          />
          <CardContent sx={{pb: '16px'}}>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Code</Typography>
                <Typography variant="body2">{course.code}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Name</Typography>
                <Typography variant="body2">{course.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary" display="block">Type</Typography>
                <Chip label={course.type} color={
                  course.type === 'Private' ? 'secondary' :
                    course.type === 'Public' ? 'primary' :
                      course.type === 'Others' ? 'error' : 'default'
                  } size="small" variant="outlined"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary" display="block">Status</Typography>
                <Chip label={course.status} color={
                  course.status === 'Draft' ? 'info' :
                    course.status === 'Active' ? 'success' :
                      course.status === 'Expired' ? 'secondary' : 'default'
                } size="small" variant="outlined"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Description</Typography>
                <Typography variant="body2">{course.description}</Typography>
              </Grid>

            </Grid>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{ display: 'flex', mx: 'auto' }}
            >
              <CaretDownIcon />
            </ExpandMore>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Term ID</Typography>
                <Typography variant="body2">{course.term.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Term Name</Typography>
                <Typography variant="body2">{course.term.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Term Start Date</Typography>
                <Typography variant="body2">{course.term.start_date}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Term End Date</Typography>
                <Typography variant="body2">{course.term.end_date}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Academic Year ID</Typography>
                <Typography variant="body2">{course.term.academic_year.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Academic Year</Typography>
                <Typography variant="body2">AY {course.term.academic_year.start_year}-{course.term.academic_year.end_year}</Typography>
              </Grid>
            </Grid>
            </Collapse>
          </CardContent>
          <Divider/>
          <CardActions sx={{ justifyContent: 'space-between'}}>
            <Box sx={{ mx: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UsersIcon size={20}/>
              <Typography sx={{ marginLeft: '10px' }} variant="body1">
                {course.enrolled_users.length.toString()}
              </Typography>
            </Box>
            {eduquestUser && course.enrolled_users.includes(eduquestUser?.id.toString()) ? (
              <Button endIcon={<CheckIcon/>} disabled>Enrolled</Button>
            ) : (
              <Button endIcon={<SignInIcon/>} onClick={() => handleEnroll()} variant="contained">Enroll</Button>
            )}
          </CardActions>
        </Card>
          ) : (
            <Typography variant="body1">Course details not available.</Typography>
          )
        )
      )}

      <form onSubmit={handleSubmit}>
        {showForm && course ? <Card>
            <CardHeader title="Course"/>
            <Divider/>

            <CardContent>

              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course ID</InputLabel>
                    <OutlinedInput defaultValue={course.id} label="Course ID" name="id" disabled/>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }} />
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Code</InputLabel>
                    <OutlinedInput defaultValue={course.code} label="Course Code" inputRef={courseCodeRef} name="code"/>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Name</InputLabel>
                    <OutlinedInput defaultValue={course.name} label="Course Name" inputRef={courseNameRef} name="name"/>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Type</InputLabel>
                    <Select defaultValue={course.type} label="Course Type" inputRef={courseTypeRef} name="type">
                      <MenuItem value="Public"><Chip variant="outlined" label="Public" color="primary" size="small"/></MenuItem>
                      <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Status</InputLabel>
                    <Select defaultValue={course.status} label="Course Status" inputRef={courseStatusRef} name="status">
                      <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                      <MenuItem value="Inactive"><Chip variant="outlined" label="Inactive" color="secondary" size="small"/></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl fullWidth required>
                    <TextField
                      defaultValue={course.description}
                      label="Course Description"
                      inputRef={courseDescriptionRef}
                      name="description"
                      multiline
                      required
                      rows={3}
                    />
                  </FormControl>
                </Grid>

              </Grid>

              <Typography sx={{my: 3}} variant="h6">Term</Typography>
              {terms ? <Grid container spacing={3}>

                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Term ID</InputLabel>
                      <Select defaultValue={course.term.id} onChange={handleTermChange} inputRef={courseTermIdRef}
                              label="Term ID" variant="outlined" type="number">
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

              {images ?
                <Grid container spacing={3} >
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Thumbnail ID</InputLabel>
                      <Select defaultValue={course.image.id} onChange={handleImageChange} inputRef={courseImageIdRef}
                              label="Thumbnail ID" variant="outlined" type="number">
                        {images.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id} - {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Name</Typography>
                    <Typography variant="body2">{selectedImage?.name || course.image.name}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                    <Typography variant="body2">{selectedImage?.filename || course.image.filename}</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
                    <CardMedia
                      component="img"
                      alt={selectedImage?.name || images[0].name}
                      image={`/assets/${selectedImage?.filename || course.image.filename}`}
                      sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
                    />
                  </Grid>
                </Grid> : null}
            </CardContent>

            <Divider/>
            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteCourse}>Delete Course</Button>
                <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Course</Button>
            </CardActions>
          </Card> : null}

        {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
            {submitStatus.message}
          </Alert> : null}

      </form>
      <Typography variant="h5">Quests</Typography>
      {loadingQuests ? (
        <SkeletonQuestCard />
      ) : (
        quests && quests.length > 0 ? (
          <QuestCard rows={quests} onQuestDeleteSuccess={getQuests}/>
        ) : (
          <Typography variant="body1">New quests are coming soon for this course!</Typography>
        )
      )}

    </Stack>


  );
}
