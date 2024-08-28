"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import type { Course } from '@/types/course';
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
import CardActions from "@mui/material/CardActions";
import RouterLink from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {QuestCard} from "@/components/dashboard/quest/quest-card";
import {useUser} from "@/hooks/use-user";
import {CardMedia} from "@mui/material";
import {Check as CheckIcon} from "@phosphor-icons/react/dist/ssr/Check";
import {SignIn as SignInIcon} from "@phosphor-icons/react/dist/ssr/SignIn";
import Box from "@mui/material/Box";
import {Users as UsersIcon} from "@phosphor-icons/react/dist/ssr/Users";
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import {styled} from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import { SkeletonCourseDetailCard } from "@/components/dashboard/skeleton/skeleton-course-detail-card";
import {CourseEditForm} from "@/components/dashboard/course/course-edit-form";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr/XCircle";
import {QuestNewForm} from "@/components/dashboard/quest/quest-new-form";
import {useState} from "react";
import {IOSSwitch} from "@/components/dashboard/misc/buttons";
import {CourseExpiresDialog} from "@/components/dashboard/dialog/course-expires-dialog";



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
  const { eduquestUser } = useUser();
  const [course, setCourse] = React.useState<Course>();
  const [quests, setQuests] = React.useState<Quest[]>();
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingQuests, setLoadingQuests] = React.useState(true);
  const [loadingCourse, setLoadingCourse] = React.useState(true);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const toggleCreateForm = (): void => {
    setShowCreateForm(!showCreateForm);
  };

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  }

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = async (status: 'Active' | 'Expired'): Promise<void> => {
    setOpenDialog(false);
    await handleStatusChange(status);
  };

  const handleStatusChange = async (status : string): Promise<void> => {
    try {
      const data = {status: status}
      const response : AxiosResponse<Course> = await apiService.patch(`/api/Course/${params.courseId}/`, data);
      setSubmitStatus({ type: 'success', message: `Course has been set to '${status}'` });
      setCourse(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to expire course', error);
        setSubmitStatus({type: 'error', message: 'Failed to change course status. Please try again.'});
      }
    }
  }

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


  const handleEnroll = async (): Promise<void> => {
    try {
      const data = {
        user: { id: eduquestUser?.id },
        course: { id: params.courseId }
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
      // await getTerms();
      // await getImages();
      await getQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>
        <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={paths.dashboard.course.all}>View all Courses</Button>

      </Stack>

      {!showEditForm && (
        loadingCourse ? (
          <SkeletonCourseDetailCard />
        ) : (
          course ? (
        <Card>
          <CardHeader
            title="Course Details"
            subheader={`ID: ${course.id.toString()}`}
            action={
              eduquestUser?.is_staff ?
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} color="error">
                  <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>

                    <IOSSwitch
                      checked={course.status === 'Active'}
                      onClick={handleDialogOpen}
                      inputProps={{ 'aria-hidden': false, 'aria-modal': true }}
                    />
                    <Typography variant="overline" color="text.secondary">
                      {course.status === 'Active' ? 'Active' : 'Expired'}
                    </Typography>
                  </Stack>
                  <Button startIcon={<PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleEditForm}>
                    Edit Course
                  </Button>
                </Stack> : null
            }
          />
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
                <Typography variant="overline" color="text.secondary">Group</Typography>
                <Typography variant="body2">{course.group}</Typography>
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
                    course.status === 'Active' ? 'success' : 'secondary'
                } size="small" variant="outlined"/>

              </Grid>
              <Grid xs={12}>
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

          <CourseExpiresDialog
            openDialog={openDialog}
            handleDialogClose={handleDialogClose}
            handleDialogConfirm={handleDialogConfirm}
            course={course}
          />

        </Card>
          ) : (
            <Typography variant="body1">Course details not available.</Typography>
          )
        )
      )}

      { showEditForm && course ?
        <CourseEditForm
          setSubmitStatus={setSubmitStatus}
          course={course}
          toggleForm={toggleEditForm}
          onUpdateSuccess={getCourse}
        />
        : null }

      {submitStatus ? (
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert>
      ) : null}

      <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center', verticalAlign: 'center', pt:3}}>
        <Box>
          <Typography variant="h5">Quests</Typography>
          <Typography variant="body2" color="text.secondary">Quests available for this course.</Typography>
        </Box>
        { eduquestUser?.is_staff ?
          <Button
            startIcon={showCreateForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant={showCreateForm ? 'text' : 'contained'}
            color={showCreateForm ? 'error' : 'primary'}
            onClick={toggleCreateForm}
          >
            {showCreateForm ? 'Cancel' : 'Create Quest'}
          </Button> : null }
      </Stack>

      {showCreateForm && course ? <QuestNewForm onFormSubmitSuccess={getQuests} courseId={course.id}/> : null}

      {loadingQuests ? (
        <SkeletonQuestCard />
      ) : (
        quests && quests.length > 0 ? (
          <QuestCard rows={quests} onQuestDeleteSuccess={getQuests}/>
        ) : (
          <Typography variant="body1">No quests available for this course.</Typography>
        )
      )}

    </Stack>


  );
}
