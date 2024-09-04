"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
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
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import CardActions from "@mui/material/CardActions";
import Link, { default as RouterLink } from "next/link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {ListChecks  as ListChecksIcon} from "@phosphor-icons/react/dist/ssr/ListChecks";
import Chip from "@mui/material/Chip";
import {useUser} from "@/hooks/use-user";
import {UserQuestAttemptTable} from "@/components/dashboard/quest/attempt/quest-attempt-table";
import { CardMedia } from "@mui/material";
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { SkeletonQuestDetailCard } from "@/components/dashboard/skeleton/skeleton-quest-detail-card";
import { SkeletonQuestAttemptTable } from "@/components/dashboard/skeleton/skeleton-quest-attempt-table";
import {NewQuestionForm} from "@/components/dashboard/quest/question/new-question-form";
import QuestEditForm from "@/components/dashboard/quest/question/quest-edit-form";
import {IOSSwitch} from "@/components/dashboard/misc/buttons";
import {useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {QuestExpiresDialog} from "@/components/dashboard/dialog/quest-expires-dialog";
import Points from "../../../../../public/assets/point.svg";


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
  const [quest, setQuest] = React.useState<Quest>();
  const [courses, setCourses] = React.useState<Course[]>();
  const [course, setCourse] = React.useState<Course>();
  const [userQuestAttempts, setUserQuestAttempts] = React.useState<UserQuestAttempt[]>();
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showEditQuestForm, setShowEditQuestForm] = React.useState(false);
  const [showNewQuestionForm, setShowNewQuestionForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingQuest, setLoadingQuest] = React.useState(true);
  const [loadingQuestAttemptTable, setLoadingQuestAttemptTable] = React.useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const toggleEditQuestForm = (): void => {
    setShowEditQuestForm(!showEditQuestForm);
  };

  const toggleNewQuestionForm = (): void => {
    setShowNewQuestionForm(!showNewQuestionForm);
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
      const filteredData = data.filter(c => c.name !== 'Private Course');
      setCourses(filteredData);
      logger.debug('Filtered Courses', filteredData);
      logger.debug('Quest from_course ID:', output?.from_course?.id);
      const foundCourse = data?.find(c => c.id === output?.from_course?.id);
      logger.debug('Found Course', foundCourse);
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


  const handleNewAttempt = async (): Promise<void> => {
    try {
      const dateString = new Date().toISOString()
      const response: AxiosResponse<UserQuestAttempt> = await apiService.post(`/api/UserQuestAttempt/`, {
        first_attempted_on: dateString,
        last_attempted_on: dateString,
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

  const handleStatusChange = async (status : string): Promise<void> => {
    try {
      const data: { status: string; expiration_date?: null } = { status };
      if (status === 'Active') {
        data.expiration_date = null;
      }
      const response : AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, data);
      setQuest(response.data);
      setSubmitStatus({ type: 'success', message: `Quest has been set to '${status}'` });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to expire quest', error);
        setSubmitStatus({type: 'error', message: 'Failed to change quest status. Please try again.'});
      }
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const output = await getQuest();
      await getCourses(output);
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

      </Stack> : null
      }

      {!showEditQuestForm && !showNewQuestionForm && (
        loadingQuest ? (
          <SkeletonQuestDetailCard />
        ) : (
          quest ? (
        <Card>
          <CardHeader
            title="Quest Details"
            subheader={`ID: ${quest.id.toString()}`}
            action={
              eduquestUser?.is_staff ?
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }} color="error">
                  <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>

                    <IOSSwitch
                      checked={quest.status === 'Active'}
                      onClick={handleDialogOpen}
                      inputProps={{ 'aria-label': 'Change State' }}
                    />
                    <Typography variant="overline" color="text.secondary">
                      {quest.status === 'Active' ? 'Active' : 'Expired'}
                    </Typography>
                  </Stack>
                  <Button startIcon={<PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleEditQuestForm}>
                    Edit Quest
                  </Button>
                </Stack> : null
            }
          />
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
                <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                  <Typography variant="overline" color="text.secondary">Type</Typography>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography fontSize="inherit">Eduquest MCQ - Quest developed in-house</Typography>
                      <Typography fontSize="inherit">Wooclap - Quest imported from Wooclap</Typography>
                      <Typography fontSize="inherit">Kahoot! - Quest imported from Kahoot!</Typography>
                      <Typography fontSize="inherit">Private - Quest for personal quest generation use only</Typography>
                    </React.Fragment>
                  } placement="right">
                    <InfoIcon style={{ cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                  </Tooltip>
                </Stack>
                <Chip variant="outlined" label={quest.type} color={
                  quest.type === 'Eduquest MCQ' ? 'primary' :
                    quest.type === 'Wooclap' ? 'neon' :
                      quest.type === 'Kahoot!' ? 'violet' :
                        quest.type === 'Private' ? 'secondary' : 'default'
                } size="small"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                  <Typography variant="overline" color="text.secondary">Status</Typography>
                  <Tooltip title="When the quest is set to 'Expired', it will no longer be available for attempts and the system will issue badges to users." placement="right">
                    <InfoIcon style={{ cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                  </Tooltip>
                </Stack>
                <Chip variant="outlined" label={quest.status} color={
                    quest.status === 'Active' ? 'success' : 'secondary'
                  } size="small"/>
              </Grid>
              <Grid md={6} xs={12}>
                <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                  <Typography variant="overline" color="text.secondary">Expiry Date</Typography>
                  <Tooltip title="When the expiry date is reached, the quest status will be set to 'Expired'." placement="right">
                    <InfoIcon style={{ cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                  </Tooltip>
                </Stack>

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
                <Typography variant="overline" color="text.secondary">Number of Questions</Typography>
                <Typography variant="body2">{quest.total_questions}</Typography>
              </Grid>

              <Grid md={6} xs={12}>
                <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                  <Typography variant="overline" color="text.secondary">Maximum Points</Typography>
                  <Tooltip title="Points earned from 'Private' quest will not be credited to your account." placement="right">
                    <InfoIcon style={{ cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                  </Tooltip>
                </Stack>
                <Stack direction="row" spacing='6px' sx={{ alignItems: 'center' }}>
                  <Typography variant="body2">{quest.total_max_score}</Typography>
                  <Points height={18}/>
                </Stack>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Maximum Number of Attempts</Typography>
                <Typography variant="body2">{quest.max_attempts}</Typography>
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
              <Grid xs={12}>
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
                <Typography variant="overline" color="text.secondary">Course Type</Typography>
                <Typography variant="body2">{quest.from_course.type}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Status</Typography>
                <Typography variant="body2">{quest.from_course.status}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Course Group</Typography>
                <Typography variant="body2">{quest.from_course.group}</Typography>
              </Grid>
              <Grid xs={12}>
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

            {course && eduquestUser && userQuestAttempts ? (
              quest.total_questions === 0 ? (
                eduquestUser.is_staff ? (
                  <Button startIcon={<ListChecksIcon/>} variant='contained' onClick={toggleNewQuestionForm}>
                    Create New Questions
                  </Button>
                ) : null
              ) : quest.status === 'Expired' ? (
                <Button disabled variant='contained'>
                  Quest has Expired
                </Button>
              ) : userQuestAttempts.length >= quest.max_attempts ? (
                <Button disabled variant='contained'>
                  No more attempts available
                </Button>
              ) : course.enrolled_users.includes(eduquestUser?.id.toString()) ? (
                <Button startIcon={<GameControllerIcon fontSize="var(--icon-fontSize-md)"/>}
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
            ) : null}
          </CardActions>

          <QuestExpiresDialog
            openDialog={openDialog}
            handleDialogClose={handleDialogClose}
            handleDialogConfirm={handleDialogConfirm}
            quest={quest}
          />


        </Card>
          ) : (
            <Typography variant="body1">Quest details not available.</Typography>
          )
        )
      )}

      {/* New Question FORM */}
      { showNewQuestionForm && quest ? (
        <NewQuestionForm
          onCreateSuccess={async () => {
            await getQuest();
            toggleNewQuestionForm();
            setSubmitStatus({ type: 'success', message: 'Questions have been successfully created.' })
          }}
          questId={params.questId}
          onCancelCreate={toggleNewQuestionForm}
        />
      ) : null}

      {/* Edit Quest FORM */}
      {showEditQuestForm && quest && courses ? (
        <QuestEditForm
          quest={quest}
          courses={courses}
          setSubmitStatus={setSubmitStatus}
          toggleForm={toggleEditQuestForm}
          onUpdateSuccess={getQuest}
          onStatusChange={handleStatusChange}
        />
      ) : null}

      {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
        {submitStatus.message}
      </Alert> : null}
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
