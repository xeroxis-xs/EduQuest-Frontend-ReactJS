"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { GameController as GameControllerIcon } from "@phosphor-icons/react/dist/ssr/GameController";
import type { Course } from '@/types/course';
import type { Quest } from '@/types/quest';
import type { UserQuestAttempt } from '@/types/user-quest-attempt';
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
import Link, { default as RouterLink } from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import Chip from "@mui/material/Chip";
import {useUser} from "@/hooks/use-user";
import {UserQuestAttemptTable} from "@/components/dashboard/quest/attempt/quest-attempt-table";
import { CardMedia } from "@mui/material";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import {Image} from "@/types/image";

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

export default function Page({ params }: { params: { questId: string } }) : React.JSX.Element {
  const router = useRouter();
  const { eduquestUser } = useUser();
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const questImageIdRef = React.useRef<HTMLInputElement>(null);
  const [quest, setQuest] = React.useState<Quest>();
  const [courses, setCourses] = React.useState<Course[]>();
  const [course, setCourse] = React.useState<Course>();
  const [images, setImages] = React.useState<Image[]>();
  const [userQuestAttempts, setUserQuestAttempts] = React.useState<UserQuestAttempt[]>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getQuest = async (): Promise<Quest | undefined> => {
    try {
      const response: AxiosResponse<Quest> = await apiService.get<Quest>(`/api/Quest/${params.questId}`);
      const data: Quest = response.data;
      setQuest(data);
      logger.debug('quest', data);
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
      return undefined;
    }
  };

  const getCourses = async (output:Quest | undefined): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>(`/api/Course/`);
      const data: Course[] = response.data;
      setCourses(data);
      logger.debug('courses', data);
      logger.debug('Quest from_course ID:', output?.from_course?.id);
      const foundCourse = data?.find(c => c.id === output?.from_course?.id);
      logger.debug('course', foundCourse);
      setCourse(foundCourse);

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  // const filterCourses = async (): Promise<void> => {
  //
  // }

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

  const getUserQuestAttempts = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<UserQuestAttempt[]> = await apiService.get<UserQuestAttempt[]>(`/api/UserQuestAttempt/by-user/${eduquestUser.id.toString()}/by-quest/${params.questId}`);
        const data: UserQuestAttempt[] = response.data;
        setUserQuestAttempts(data);
        logger.debug('user quest attempts', data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
        }
        logger.error('Failed to fetch data', error);
      }
    }
  }

  const handleCourseChange = (event: SelectChangeEvent<number>) => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const courseId = Number(event.target.value); // Convert the value to a number
    const newCourse = courses?.find(c => c.id === courseId);
    if (newCourse) {
      setSelectedCourse({
        id: newCourse.id,
        name: newCourse.name,
        code: newCourse.code,
        description: newCourse.description,
        status: newCourse.status,
        term: newCourse.term,
        enrolled_users: newCourse.enrolled_users,
        image: newCourse.image,
      });
    }
  };

  const handleImageChange = (event: SelectChangeEvent<number>) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      from_course: selectedCourse || quest?.from_course,
      image: selectedImage || quest?.image
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, updatedQuest);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      await getQuest();
      setShowForm(false)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Submit Error:', error);
        setSubmitStatus({type: 'error', message: 'Update Failed. Please try again.'});
      }
    }

  };

  const handleDeleteQuest = async () => {
    try {
      await apiService.delete(`/api/Quest/${params.questId}`);
      router.push(paths.dashboard.quest);
    } catch (error) {
      logger.error('Failed to delete the quest', error);
      setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
    }
  };

  const handleNewAttempt = async () => {
    try {
      const response: AxiosResponse<UserQuestAttempt> = await apiService.post(`/api/UserQuestAttempt/`, {
        first_attempted_on: new Date().toISOString(),
        last_attempted_on: new Date().toISOString(),
        submitted: false,
        time_taken: 0,
        user: eduquestUser?.id,
        quest: params.questId as unknown as number,
      });
      logger.debug('New Attempt created:', response.data);
      router.push(`/dashboard/quest/${params.questId}/quest-attempt/${response.data.id.toString()}`);
    } catch (error) {
      logger.error('Failed to create a new attempt', error);
      setSubmitStatus({ type: 'error', message: 'Failed to create a new attempt. Please try again.' });
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const output = await getQuest();
      await getCourses(output);
      await getImages();
      await getUserQuestAttempts();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      {quest &&
      <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={`/dashboard/course/${quest?.from_course.id.toString()}`}>View Quests for {quest.from_course.code} {quest.from_course.name}</Button>
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Quest'}
        </Button>
      </Stack>
      }

      {!showForm && quest ?
        <Card>
          <CardHeader title="Quest Details"/>
          <CardMedia
            component="img"
            alt={quest.image.name}
            image={`/assets/${quest.image.filename}`}
            sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
          />
          <CardContent sx={{pb: '16px'}}>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest ID</Typography>
                <Typography variant="body2">{quest.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Type</Typography>
                <Typography variant="body2">{quest.type}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Name</Typography>
                <Typography variant="body2">{quest.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Number of Questions</Typography>
                <Typography variant="body2">{quest.total_questions}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Description</Typography>
                <Typography variant="body2">{quest.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Maximum Score</Typography>
                <Typography variant="body2">{quest.total_max_score}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Created By</Typography>
                <Typography variant="body2">{quest.organiser.username}</Typography>
                <Typography variant="body2">{quest.organiser.email}</Typography>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Status</Typography>
                <Chip label={quest.status} sx={{ mt: 1 }} color="success" size="small"/>
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
                <Typography variant="subtitle2">Course ID</Typography>
                <Typography variant="body2">
                  <Link href={`/dashboard/course/${quest.from_course.id.toString()}`}>{quest.from_course.id}</Link>
                </Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Code</Typography>
                <Typography variant="body2">{quest.from_course.code}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Name</Typography>
                <Typography variant="body2">{quest.from_course.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Description</Typography>
                <Typography variant="body2">{quest.from_course.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Year / Term</Typography>
                <Typography variant="body2">AY {quest.from_course.term.academic_year.start_year}-{quest.from_course.term.academic_year.end_year} / {quest.from_course.term.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Duration</Typography>
                <Typography variant="body2">From {quest.from_course.term.start_date} to {quest.from_course.term.end_date}</Typography>
              </Grid>
            </Grid>
            </Collapse>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>

            {course && eduquestUser && (
              course.enrolled_users.includes(eduquestUser.id) ? (
                <Button endIcon={<GameControllerIcon fontSize="var(--icon-fontSize-md)"/>}
                        variant='contained'
                        onClick={handleNewAttempt}
                >
                  Start New Attempt
                </Button>
              ) : (
                <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)" />}
                        variant='outlined'
                        component={RouterLink}
                        href={`/dashboard/course/${quest.from_course.id.toString()}`}
                >
                  Enroll Course before attempting
                </Button>
              )
            )}


          </CardActions>
        </Card> : null}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        {showForm && quest ? <Card>
            <CardHeader title={`Quest ${quest.id.toString()}`}/>
            <Divider/>

            <CardContent>

              <Grid container spacing={3}>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Type</InputLabel>
                    <OutlinedInput defaultValue={quest.type} label="Quest Type" inputRef={questTypeRef} name="code"/>
                  </FormControl>
                </Grid>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Name</InputLabel>
                    <OutlinedInput defaultValue={quest.name} label="Quest Name" inputRef={questNameRef} name="name"/>
                  </FormControl>
                </Grid>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Status</InputLabel>
                    <OutlinedInput defaultValue={quest.status} label="Quest Status" inputRef={questStatusRef}
                                   name="status"/>
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Description</InputLabel>
                    <OutlinedInput defaultValue={quest.description} label="Quest Description"
                                   inputRef={questDescriptionRef} name="description"/>
                  </FormControl>
                </Grid>

              </Grid>

              <Divider sx={{my: 4}}/>

              <Typography sx={{my: 3}} variant="h6">Course</Typography>
              {courses ?
                <Grid container spacing={3} >
                  <Grid md={3} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course ID</InputLabel>
                      <Select defaultValue={quest.from_course.id} onChange={handleCourseChange} inputRef={questCourseIdRef}
                              label="Course ID" variant="outlined" type="number">
                        {courses.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    </Grid>
                    <Grid md={9} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Name</Typography>
                    <Typography variant="body2">{selectedCourse?.name || quest.from_course.name }</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Code</Typography>
                    <Typography variant="body2">{selectedCourse?.code || quest.from_course.code}</Typography>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Typography variant="subtitle2">Course Description</Typography>
                    <Typography variant="body2">{selectedCourse?.description || quest.from_course.description}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Year / Term</Typography>
                    <Typography variant="body2">
                      AY {selectedCourse?.term.academic_year.start_year || quest.from_course.term.academic_year.start_year}-{selectedCourse?.term.academic_year.end_year || courses[0].term.academic_year.end_year} / {selectedCourse?.term.name || courses[0].term.name}
                    </Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Duration</Typography>
                    <Typography variant="body2">
                      From {selectedCourse?.term.start_date || quest.from_course.term.start_date} to {selectedCourse?.term.end_date || courses[0].term.end_date}
                    </Typography>
                  </Grid>
                </Grid> : null}

              <Divider sx={{my: 4}}/>

              <Typography sx={{my: 3}} variant="h6">Thumbnail</Typography>

              {images ?
                <Grid container spacing={3} >
                  <Grid md={3} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Thumbnail ID</InputLabel>
                      <Select defaultValue={quest.image.id} onChange={handleImageChange} inputRef={questImageIdRef}
                              label="Image ID" variant="outlined" type="number">
                        {images.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid md={9} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Thumbnail Name</Typography>
                    <Typography variant="body2">{selectedImage?.name || quest.image.name}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Thumbnail Filename</Typography>
                    <Typography variant="body2">{selectedImage?.filename || quest.image.filename}</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="subtitle2">Thumbnail Preview</Typography>
                    <CardMedia
                      component="img"
                      alt={selectedImage?.name || quest.image.name}
                      image={`/assets/${selectedImage?.filename || quest.image.filename}`}
                      sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}/>
                  </Grid>
                </Grid> : null}

            </CardContent>

            <Divider/>
            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteQuest}>Delete Quest</Button>
                <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Quest</Button>
            </CardActions>
          </Card> : null}

        {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
            {submitStatus.message}
          </Alert> : null}

      </form>

      <Typography variant="h6">My Attempts</Typography>

        {userQuestAttempts && userQuestAttempts.length > 0 ? (
          <UserQuestAttemptTable rows={userQuestAttempts} questId={params.questId} totalMaxScore={quest?.total_max_score}/>
        ) : (
          <Typography variant="body1">You have not attempted this quest yet.</Typography>
        )}


    </Stack>


  );
}
