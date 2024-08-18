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
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CalendarX as CalendarXIcon } from "@phosphor-icons/react/dist/ssr/CalendarX";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import {type Image} from "@/types/image";
import { SkeletonQuestDetailCard } from "@/components/dashboard/skeleton/skeleton-quest-detail-card";
import { SkeletonQuestAttemptTable } from "@/components/dashboard/skeleton/skeleton-quest-attempt-table";
import {NewQuestionForm} from "@/components/dashboard/quest/question/new-question-form";


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
  const questMaxAttemptsRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questExpirationDateRef = React.useRef<HTMLInputElement>(null);
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
  const [showEditQuestForm, setShowEditQuestForm] = React.useState(false);
  const [showNewQuestionForm, setShowNewQuestionForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingQuest, setLoadingQuest] = React.useState(true);
  const [loadingQuestAttemptTable, setLoadingQuestAttemptTable] = React.useState(true);

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const toggleEditQuestForm = (): void => {
    setShowEditQuestForm(!showEditQuestForm);
  };

  const toggleNewQuestionForm = (): void => {
    setShowNewQuestionForm(!showNewQuestionForm);
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
    } finally {
      setLoadingQuest(false);
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
      } finally {
        setLoadingQuestAttemptTable(false);
      }
    }
  }

  const handleCourseChange = (event: SelectChangeEvent<number>): void => {
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
        type: newCourse.type,
        term: newCourse.term,
        enrolled_users: newCourse.enrolled_users,
        image: newCourse.image,
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

  const handleQuestSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const updatedQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      expiration_date: questExpirationDateRef.current?.value
        ? new Date(questExpirationDateRef.current.value).toISOString()
        : null,
      max_attempts: questMaxAttemptsRef.current?.value,
      from_course: selectedCourse || quest?.from_course,
      image: selectedImage || quest?.image
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, updatedQuest);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      await getQuest();
      setShowEditQuestForm(false)
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

  const handleDeleteQuest = async (): Promise<void> => {
    try {
      await apiService.delete(`/api/Quest/${params.questId}`);
      router.push(paths.dashboard.quest.all);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to delete the quest', error);
        setSubmitStatus({type: 'error', message: 'Delete Failed. Please try again.'});
      }
    }
  };

  const handleNewAttempt = async (): Promise<void> => {
    try {
      const response: AxiosResponse<UserQuestAttempt> = await apiService.post(`/api/UserQuestAttempt/`, {
        last_attempted_on: new Date().toISOString(),
        all_questions_submitted: false,
        user: eduquestUser?.id,
        quest: {
          id: params.questId as unknown as number
        },
      });
      logger.debug('New Attempt created:', response.data);
      router.push(`/dashboard/quest/${params.questId}/quest-attempt/${response.data.id.toString()}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to create a new attempt', error);
        setSubmitStatus({type: 'error', message: 'Failed to create a new attempt. Please try again.'});
      }
    }
  }

  const handleExpires = async (): Promise<void> => {
    try {
      const data = { status: 'Expired' }
      const response : AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, data);
      setQuest(response.data);
      setSubmitStatus({ type: 'success', message: 'Quest has been set to expired' });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to expire quest', error);
        setSubmitStatus({type: 'error', message: 'Failed to expire quest. Please try again.'});
      }
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
      {quest ? <Stack direction="row" sx={{justifyContent: 'space-between'}}>
        <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={`/dashboard/course/${quest?.from_course.id.toString()}`}>View Quests for {quest.from_course.code} {quest.from_course.name}</Button>
        {eduquestUser?.is_staff ?
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} color="error">
            <Button startIcon={<CalendarXIcon fontSize="var(--icon-fontSize-md)"/>} onClick={handleExpires} color="error" >Expires Quest</Button>
            <Button startIcon={showEditQuestForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleEditQuestForm}>
              {showEditQuestForm ? 'Close' : 'Edit Quest'}
            </Button>
          </Stack> : null}
      </Stack> : null
      }

      {!showEditQuestForm && !showNewQuestionForm && (
        loadingQuest ? (
          <SkeletonQuestDetailCard />
        ) : (
          quest ? (
        <Card>
          <CardHeader title="Quest Details" subheader={`ID: ${quest.id.toString()}`}/>
          <CardMedia
            component="img"
            alt={quest.image.name}
            image={`/assets/${quest.image.filename}`}
            sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
          />
          <CardContent sx={{pb: '16px'}}>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Name</Typography>
                <Typography variant="body2">{quest.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Description</Typography>
                <Typography variant="body2">{quest.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary" display="block">Type</Typography>
                <Chip variant="outlined" label={quest.type} color={
                  quest.type === 'Eduquest MCQ' ? 'primary' :
                    quest.type === 'Wooclap' ? 'neon' :
                      quest.type === 'Kahoot!' ? 'violet' :
                        quest.type === 'Private' ? 'secondary' : 'default'
                } size="small"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary" display="block">Status</Typography>
                <Chip variant="outlined" label={quest.status} color={
                  quest.status === 'Draft' ? 'default' :
                    quest.status === 'Active' ? 'success' :
                      quest.status === 'Expired' ? 'secondary' : 'default'
                  } size="small"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Number of Questions</Typography>
                <Typography variant="body2">{quest.total_questions}</Typography>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Maximum Score</Typography>
                <Typography variant="body2">{quest.total_max_score}</Typography>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Maximum Number of Attempts</Typography>
                <Typography variant="body2">{quest.max_attempts}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Expiry Date</Typography>
                {quest.expiration_date ? (
                  <Typography variant="body2">
                    {new Date(quest.expiration_date).toLocaleDateString("en-SG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    No Expiry Date Set
                  </Typography>
                )}

              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Created By</Typography>
                <Typography variant="body2">{quest.organiser.username}</Typography>
                <Typography variant="body2">{quest.organiser.email}</Typography>
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
                <Typography variant="overline" color="text.secondary">Course ID</Typography>
                <Typography variant="body2">
                  <Link href={`/dashboard/course/${quest.from_course.id.toString()}`}>{quest.from_course.id}</Link>
                </Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Code</Typography>
                <Typography variant="body2">{quest.from_course.code}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Name</Typography>
                <Typography variant="body2">{quest.from_course.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Description</Typography>
                <Typography variant="body2">{quest.from_course.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Year / Term</Typography>
                <Typography variant="body2">AY {quest.from_course.term.academic_year.start_year}-{quest.from_course.term.academic_year.end_year} / {quest.from_course.term.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Duration</Typography>
                <Typography variant="body2">From {quest.from_course.term.start_date} to {quest.from_course.term.end_date}</Typography>
              </Grid>
            </Grid>
            </Collapse>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>

            {course && eduquestUser && userQuestAttempts ? quest.total_questions === 0 ? (
              <Button startIcon={<PlusIcon/>} variant='contained' onClick={toggleNewQuestionForm}>
                Create New Questions
              </Button>
            ) : quest.status !== 'Active' ? (
              <Button disabled variant='contained'>
                Quest has Expired
              </Button>
            ) : userQuestAttempts.length >= quest.max_attempts ? (
              <Button disabled variant='contained'>
                No more attempts available
              </Button>
            ) : course.enrolled_users.includes(eduquestUser?.id.toString()) ? (
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
            ) : null}


          </CardActions>
        </Card>
          ) : (
            <Typography variant="body1">Quest details not available.</Typography>
          )
        )
      )}

      {/* New Question FORM */}
      { showNewQuestionForm && quest ? (
        <NewQuestionForm onCreateSuccess={getQuest} quest={quest} onCancelCreate={toggleNewQuestionForm}/>
        ) : null}



      {/* Edit Quest FORM */}
      <form onSubmit={handleQuestSubmit}>
        {showEditQuestForm && quest ?
          <Card>
            <CardHeader title={`Quest ${quest.id.toString()}`}/>
            <Divider/>

            <CardContent>

              <Grid container spacing={3}>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Name</InputLabel>
                    <OutlinedInput defaultValue={quest.name} label="Quest Name" inputRef={questNameRef} name="name"/>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Type</InputLabel>
                    <Select defaultValue={quest.type} label="Quest Type" inputRef={questTypeRef} name="type">
                      <MenuItem value="Eduquest MCQ"><Chip variant="outlined" label="Eduquest MCQ" color="primary" size="small"/></MenuItem>
                      <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                      <MenuItem value="Kahoot!"><Chip variant="outlined" label="Kahoot!" color="violet" size="small"/></MenuItem>
                      <MenuItem value="Wooclap"><Chip variant="outlined" label="Wooclap" color="neon" size="small"/></MenuItem>
                    </Select>

                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Status</InputLabel>
                    <Select defaultValue={quest.status} label="Quest Status" inputRef={questStatusRef} name="status">
                      <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                      <MenuItem value="Expired"><Chip variant="outlined" label="Expired" color="default" size="small"/></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Maximum Attempts</InputLabel>
                    <OutlinedInput defaultValue={quest.max_attempts} label="Quest Maximum Attempts" inputRef={questMaxAttemptsRef} name="max_attempts" type="number"/>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Quest Expiry Date</InputLabel>
                    <OutlinedInput
                      label="Quest Expiry Date"
                      defaultValue={quest.expiration_date ? quest.expiration_date : ''}
                      inputRef={questExpirationDateRef}
                      name="expiration_date"
                      type="datetime-local"
                    />
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
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course ID</InputLabel>
                      <Select defaultValue={quest.from_course.id} onChange={handleCourseChange} inputRef={questCourseIdRef}
                              label="Course ID" variant="outlined" type="number">
                        {courses.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id} - {option.code} {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    </Grid>
                    <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Course Name</Typography>
                    <Typography variant="body2">{selectedCourse?.name || quest.from_course.name }</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Course Code</Typography>
                    <Typography variant="body2">{selectedCourse?.code || quest.from_course.code}</Typography>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Typography variant="overline" color="text.secondary">Course Description</Typography>
                    <Typography variant="body2">{selectedCourse?.description || quest.from_course.description}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Course Year / Term</Typography>
                    <Typography variant="body2">
                      AY {selectedCourse?.term.academic_year.start_year || quest.from_course.term.academic_year.start_year}-{selectedCourse?.term.academic_year.end_year || courses[0].term.academic_year.end_year} / {selectedCourse?.term.name || courses[0].term.name}
                    </Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Course Duration</Typography>
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
                              label="Thumbnail ID" variant="outlined" type="number">
                        {images.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id} - {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid md={9} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Name</Typography>
                    <Typography variant="body2">{selectedImage?.name || quest.image.name}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                    <Typography variant="body2">{selectedImage?.filename || quest.image.filename}</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
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

      {loadingQuestAttemptTable ? (
        <SkeletonQuestAttemptTable />
      ) : (
        userQuestAttempts && userQuestAttempts.length > 0 ? (
          <UserQuestAttemptTable
            rows={userQuestAttempts}
            questId={params.questId}
            totalMaxScore={quest?.total_max_score}
            questStatus={quest?.status}
          />
        ) : (
          <Typography variant="body1">You have not attempted this quest yet.</Typography>
        )
      )}


    </Stack>


  );
}
