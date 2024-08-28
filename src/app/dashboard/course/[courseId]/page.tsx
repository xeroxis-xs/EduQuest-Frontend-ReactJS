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
import {styled, useTheme} from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import { SkeletonCourseDetailCard } from "@/components/dashboard/skeleton/skeleton-course-detail-card";
import {CourseEditForm} from "@/components/dashboard/course/course-edit-form";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr/XCircle";



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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

export default function Page({ params }: { params: { courseId: string } }) : React.JSX.Element {
  const { eduquestUser } = useUser();
  const [course, setCourse] = React.useState<Course>();
  const [quests, setQuests] = React.useState<Quest[]>();
  const [showForm, setShowForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingQuests, setLoadingQuests] = React.useState(true);
  const [loadingCourse, setLoadingCourse] = React.useState(true);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);




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

  const [status, setStatus] = React.useState('Active');

  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: string,
  ) => {
    setStatus(newStatus);
  };

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

      {!showForm && (
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
                <Button startIcon={<PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
                  Edit Course
                </Button> : null
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
        </Card>
          ) : (
            <Typography variant="body1">Course details not available.</Typography>
          )
        )
      )}

      { showForm && course ?
        <CourseEditForm
          setSubmitStatus={setSubmitStatus}
          course={course}
          toggleForm={toggleForm}
          onUpdateSuccess={getCourse}
        />
        : null }

      {submitStatus ? (
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert>
      ) : null}


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
