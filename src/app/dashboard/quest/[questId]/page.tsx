"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { GameController as GameControllerIcon } from "@phosphor-icons/react/dist/ssr/GameController";
import type { Quest } from '@/types/quest';
import type { UserQuestAttempt } from '@/types/user-quest-attempt';
import { logger } from '@/lib/default-logger'
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import CardActions from "@mui/material/CardActions";
import { default as RouterLink } from "next/link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {ListChecks  as ListChecksIcon} from "@phosphor-icons/react/dist/ssr/ListChecks";
import Chip from "@mui/material/Chip";
import {useUser} from "@/hooks/use-user";
import {UserQuestAttemptTable} from "@/components/dashboard/quest/attempt/quest-attempt-table";
import { CardMedia } from "@mui/material";
import { SkeletonQuestDetailCard } from "@/components/dashboard/skeleton/skeleton-quest-detail-card";
import { SkeletonQuestAttemptTable } from "@/components/dashboard/skeleton/skeleton-quest-attempt-table";
import {NewQuestionForm} from "@/components/dashboard/quest/question/new-question-form";
import QuestEditForm from "@/components/dashboard/quest/quest-edit-form";
import {IOSSwitch} from "@/components/dashboard/misc/buttons";
import {useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {QuestExpiresDialog} from "@/components/dashboard/dialog/quest-expires-dialog";
import Points from "../../../../../public/assets/point.svg";
import {getQuest, updateQuest} from "@/api/services/quest";
import {getUserCourseGroupEnrollmentsByCourseAndUser} from "@/api/services/user-course-group-enrollment";
import {type UserCourseGroupEnrollment} from "@/types/user-course-group-enrollment";
import {createUserQuestAttempt, getUserQuestAttemptsByUserAndQuest} from "@/api/services/user-quest-attempt";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import {getUserAnswerAttemptByUserQuestAttempt} from "@/api/services/user-answer-attempt";
import {type UserAnswerAttempt} from "@/types/user-answer-attempt";
import {AnswerAttemptCard} from "@/components/dashboard/quest/question/attempt/answer-attempt-card";
import Box from "@mui/material/Box";


export default function Page({ params }: { params: { questId: string } }) : React.JSX.Element {
  const { eduquestUser } = useUser();

  const [courseEnrollments, setCourseEnrollments] = React.useState<UserCourseGroupEnrollment[]>();
  const [quest, setQuest] = React.useState<Quest>();
  const [userQuestAttempts, setUserQuestAttempts] = React.useState<UserQuestAttempt[]>();
  const [userAnswerAttempts, setUserAnswerAttempts] = React.useState<UserAnswerAttempt[]>([]);
  const [userAnswerAttemptIdAndStatus, setUserAnswerAttemptIdAndStatus] = React.useState<{ attemptId: string; submitted: boolean } | null>(null);

  const [showAnswerAttemptsMode, setShowAnswerAttemptsMode] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showEditQuestForm, setShowEditQuestForm] = React.useState(false);
  const [showNewQuestionForm, setShowNewQuestionForm] = React.useState(false);

  const [loadingCourseEnrollments, setLoadingCourseEnrollments] = React.useState(true);
  const [loadingQuest, setLoadingQuest] = React.useState(true);
  const [loadingQuestAttemptTable, setLoadingQuestAttemptTable] = React.useState(true);
  const [loadingUserAnswerAttempts, setLoadingUserAnswerAttempts] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewAnswerAttempts = async ({ attemptId, submitted }: { attemptId: string; submitted: boolean }): Promise<void> => {
    try {
      setLoadingUserAnswerAttempts(true);
      setUserAnswerAttemptIdAndStatus({ attemptId, submitted });
      toggleAnswerAttemptMode();
      // Fetch the selected user answer attempts
      const response = await getUserAnswerAttemptByUserQuestAttempt(attemptId);
      setUserAnswerAttempts(response);
    } catch (error: unknown) {
      logger.error('Failed to fetch user answer attempts', error);
    } finally {
      setLoadingUserAnswerAttempts(false);
    }
  }

  const handleAnswerSubmit = async (): Promise<void> => {
    // Refresh the quest attempts table
    await fetchMyQuestAttempts();
    toggleAnswerAttemptMode()
  }

  const toggleAnswerAttemptMode = (): void => {
    setShowAnswerAttemptsMode(!showAnswerAttemptsMode);
  }

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

  const fetchQuest = async (): Promise<string | undefined> => {
    try {
      const response = await getQuest(params.questId);
      setQuest(response);
      // logger.debug('Quest fetched:', response);
      return response.course_group.course.id.toString();
    } catch (error: unknown) {
      logger.error('Failed to fetch quest', error);
    } finally {
      setLoadingQuest(false);
    }
  }

  const fetchEnrollment = async (userId: string, courseId: string): Promise<void> => {
    try {
      const response = await getUserCourseGroupEnrollmentsByCourseAndUser(courseId, userId);
      setCourseEnrollments(response);
      // logger.debug('My Course enrollments fetched:', response);
    } catch (error: unknown) {
      logger.error('Failed to fetch course enrollments', error);
    } finally {
      setLoadingCourseEnrollments(false);
    }
  }

  const fetchMyQuestAttempts = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response = await getUserQuestAttemptsByUserAndQuest(eduquestUser.id.toString(), params.questId);
        setUserQuestAttempts(response);
      } catch (error: unknown) {
        logger.error('Failed to fetch user quest attempts', error);
      } finally {
        setLoadingQuestAttemptTable(false);
      }
    }
  }

  const onAnswerChange = (attemptId: number, answerId: number, isChecked: boolean): void => {
    setUserAnswerAttempts(prevData =>
      prevData.map(attempt => {
        if (attempt.id === attemptId && attempt.answer.id === answerId) {
          return { ...attempt, is_selected: isChecked };
        }
        return attempt;
      })
    );
  };

  const handleNewAttempt = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const dateString = new Date().toISOString()
        const newAttempt = {
          student_id: eduquestUser.id,
          quest_id: params.questId as unknown as number,
          first_attempted_date: dateString,
        };
        // Create a new quest attempt, backend will create an empty set of user answer attempts
        const userQuestAttempt = await createUserQuestAttempt(newAttempt)

        // Refresh the quest attempts table
        await fetchMyQuestAttempts();

        // Redirect to the new attempt component
        await handleViewAnswerAttempts({ attemptId: userQuestAttempt.id.toString(), submitted: false });
      } catch (error: unknown) {
        logger.error('Failed to create a new attempt', error);
        setSubmitStatus({type: 'error', message: 'Failed to create a new attempt. Please try again.'});
      }
    }
  }

  const handleStatusChange = async (status : string): Promise<void> => {
    try {
      const updatedQuest: {
        status: string;
        expiration_date?: null } = { status };
      if (status === 'Active') {
        updatedQuest.expiration_date = null;
      }
      const response = await updateQuest(params.questId, updatedQuest);
      setQuest(response);
      setSubmitStatus({ type: 'success', message: `Quest has been set to '${status}'` });
    } catch (error: unknown) {
      logger.error('Failed to expire quest', error);
      setSubmitStatus({type: 'error', message: 'Failed to change quest status. Please try again.'});
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const courseId = await fetchQuest();
      if (eduquestUser && courseId) {
        await fetchEnrollment(eduquestUser.id.toString(), courseId);
      }
      await fetchMyQuestAttempts();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        {showAnswerAttemptsMode ? (
          <Button startIcon={<CaretLeftIcon />} onClick={toggleAnswerAttemptMode}>
            Return to Quest
          </Button>
        ) : (
          quest ? (
            <Button startIcon={<CaretLeftIcon />} component={RouterLink} href={`/dashboard/course/${quest?.course_group.course.id.toString()}`}>
              View other Quests
            </Button>
          ) : null
        )}
      </Stack>

      {showAnswerAttemptsMode ? (
        loadingUserAnswerAttempts ? (
          <SkeletonQuestAttemptTable />
        ) : (
          userAnswerAttempts && userAnswerAttemptIdAndStatus ? (
            <AnswerAttemptCard
              data={userAnswerAttempts}
              userQuestAttemptId={userAnswerAttemptIdAndStatus.attemptId}
              submitted={userAnswerAttemptIdAndStatus.submitted}
              onAnswerChange={onAnswerChange}
              onAnswerSubmit={handleAnswerSubmit}
              onAnswerSave={fetchMyQuestAttempts}
            />
          ) : null
        )
      )

        :

      <Box>

      {!showEditQuestForm && !showNewQuestionForm && (
        loadingQuest && loadingCourseEnrollments ? (
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

          <CardContent sx={{pb: '16px'}}>
            <Grid container spacing={3}>
              <Grid md={3} xs={12} display="flex" justifyContent="center" alignItems="center">
                <CardMedia
                  component="img"
                  alt={quest.image.name}
                  image={`/assets/${quest.image.filename}`}
                />
              </Grid>
              <Grid container md={9} xs={12}>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Name</Typography>
                  <Typography variant="body2">{quest.name}</Typography>
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
                  <Typography variant="overline" color="text.secondary">Description</Typography>
                  <Typography variant="body2">{quest.description}</Typography>
                </Grid>

                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Created By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <UserIcon size={18}/>
                    <Typography variant="body2">{quest.organiser.nickname}</Typography>
                  </Stack>
                </Grid>

                <Grid md={6} xs={12}>
                  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                    <Typography variant="overline" color="text.secondary">Type</Typography>
                    <Tooltip title={
                      <Typography variant="inherit">
                        <strong>Eduquest MCQ</strong> Quest developed from EduQuest<br />
                        <strong>Wooclap:</strong> Quest imported from Wooclap<br />
                        <strong>Kahoot!:</strong> Quest imported from Kahoot!<br />
                        <strong>Private:</strong> Quest for personal quest generation use only
                      </Typography>
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
                      No expiry date set
                    </Typography>
                  )}

                </Grid>
                <Grid md={6} xs={12}>
                  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                    <Typography variant="overline" color="text.secondary">Tutorial Date</Typography>
                    <Tooltip title="The date and time of the tutorial session conducted" placement="right">
                      <InfoIcon style={{ cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                    </Tooltip>
                  </Stack>

                  {quest.tutorial_date ? (
                    <Typography variant="body2">
                      {new Date(quest.tutorial_date).toLocaleDateString("en-SG", {
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
                      No tutorial date set
                    </Typography>
                  )}

                </Grid>

                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Number of Questions</Typography>
                  <Typography variant="body2">{quest.total_questions}</Typography>
                </Grid>

                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Maximum Number of Attempts</Typography>
                  <Typography variant="body2">{quest.max_attempts}</Typography>
                </Grid>

              </Grid>


            </Grid>

          </CardContent>

          <CardActions sx={{ justifyContent: 'center' }}>

            {courseEnrollments && eduquestUser && userQuestAttempts ? (
              courseEnrollments.some(enrollment => enrollment.course_group.id === quest.course_group.id) ? (
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
                ) : (
                  <Button startIcon={<GameControllerIcon fontSize="var(--icon-fontSize-md)"/>}
                          variant='contained'
                          onClick={handleNewAttempt}
                  >
                    Start New Attempt
                  </Button>
                )
              ) : (
                <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)" />}
                        variant='outlined'
                        component={RouterLink}
                        href={`/dashboard/course/${quest.course_group.course.id.toString()}`}
                >
                  You are not enrolled in this group
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
            await fetchQuest();
            toggleNewQuestionForm();
            setSubmitStatus({ type: 'success', message: 'Questions have been successfully created.' })
          }}
          questId={params.questId}
          onCancelCreate={toggleNewQuestionForm}
        />
      ) : null}

      {/* Edit Quest FORM */}
      {showEditQuestForm && quest ? (
        <QuestEditForm
          quest={quest}
          setSubmitStatus={setSubmitStatus}
          toggleForm={toggleEditQuestForm}
          onUpdateSuccess={fetchQuest}
          onStatusChange={handleStatusChange}
        />
      ) : null}

      {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
        {submitStatus.message}
      </Alert> : null}
      <Typography variant="h5" sx={{ mt:4, mb:2 }}>My Attempts</Typography>

      {loadingQuestAttemptTable ? (
        <SkeletonQuestAttemptTable />
      ) : (
        userQuestAttempts && userQuestAttempts.length > 0 ? (
          <UserQuestAttemptTable
            rows={userQuestAttempts}
            questId={params.questId}
            totalMaxScore={quest?.total_max_score}
            questStatus={quest?.status}
            handleViewAnswerAttempts={handleViewAnswerAttempts}
          />
        ) : (
          <Typography variant="body1">You have not attempted this quest yet.</Typography>
        )
      )}
      </Box>
      }


    </Stack>


  );
}
