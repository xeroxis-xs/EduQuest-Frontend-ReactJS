"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardHeader from "@mui/material/CardHeader";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { PaperPlaneTilt as PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeClosed as EyeClosedIcon } from "@phosphor-icons/react/dist/ssr/EyeClosed";
import {Divider} from "@mui/material";
import { type UserQuestQuestionAttempt } from "@/types/user-quest-question-attempt";
import {logger} from "@/lib/default-logger";
import apiService from "@/api/api-service";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import Points from "../../../../../../public/assets/point.svg";
import Stack from "@mui/material/Stack";
import { useUser } from '@/hooks/use-user';
import Alert from "@mui/material/Alert";
import {useRouter} from "next/navigation";


interface QuestionAttemptCardProps {
  data?: UserQuestQuestionAttempt[];
  onDataChange: (attemptId: number, answerId: number, isChecked: boolean) => void;
  // onSubmitResult: (status: { type: 'success' | 'error'; message: string }) => void;
  // onSaveResult: (status: { type: 'success' | 'error'; message: string }) => void;
  userQuestAttemptId: string;
  questId: string;
}


export function setScoreAchievedSubmittedLastAttemptedOn(data: UserQuestQuestionAttempt[]): UserQuestQuestionAttempt[] {
  const lastAttemptedOn = new Date().toISOString();

  return data.map(attempt => {
    const totalAnswers = attempt.question.answers.length;
    const scorePerAnswer = attempt.question.max_score / totalAnswers;

    let scoreAchieved = 0;

    attempt.question.answers.forEach(answer => {
      const isSelected = attempt.selected_answers.some(selectedAnswerRecord => selectedAnswerRecord.answer.id === answer.id && selectedAnswerRecord.is_selected);
      if ((answer.is_correct && isSelected) || (!answer.is_correct && !isSelected)) {
        scoreAchieved += scorePerAnswer;
      }
    });

    scoreAchieved = Math.max(0, scoreAchieved);

    return {
      ...attempt,
      score_achieved: scoreAchieved,
      submitted: true,
      last_attempted_on: lastAttemptedOn
    };
  });
}


export function setLastAttemptedOn(data: UserQuestQuestionAttempt[]) : UserQuestQuestionAttempt[] {
  return data.map(attempt => ({
    ...attempt,
    last_attempted_on: new Date().toISOString()
  }));
}


export function QuestionAttemptCard({ data = [], userQuestAttemptId, questId, onDataChange }: QuestionAttemptCardProps): React.JSX.Element {
  const { checkSession } = useUser();
  const [page, setPage] = React.useState(1);
  const [showExplanation, setShowExplanation] = React.useState<Record<number, boolean>>({});
  const rowsPerPage = 1;
  const pageCount = Math.ceil(data.length / rowsPerPage);
  const currentAttemptedQuestionsAndAnswers = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const [status, setStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const refreshUser = async (): Promise<void> => {
    if (checkSession) {
      await checkSession();
    }
  };
  const bulkUpdateUserQuestQuestionAttempt = async (updateUserQuestQuestionAttempt: UserQuestQuestionAttempt[]): Promise<void> => {
    try {
      const response = await apiService.patch(`/api/UserQuestQuestionAttempt/bulk-update/`, updateUserQuestQuestionAttempt);
      if (response.status === 200) {
        logger.debug('Bulk Update UserQuestQuestionAttempt Success:', response.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Bulk Update UserQuestQuestionAttempt Failed:', error.response?.data);
      }
    }
  }

  const updateUserQuestAttempt = async (
    updatedUserQuestAttempt: {
      all_questions_submitted: boolean,
      last_attempted_on: string
    }
  ): Promise<void> => {
    try {
      const response = await apiService.patch(`/api/UserQuestAttempt/${userQuestAttemptId}/`, updatedUserQuestAttempt);
      if (response.status === 200) {

        logger.debug('Set submit and last_attempted_date success for UserQuestAttempt:', response.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to update last_attempted_date and submit', error);
    }
  }

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    const updatedData = setLastAttemptedOn(data);
    logger.debug("Save button clicked, updated questions: ", updatedData);
    // Update UserQuestQuestionAttempt to set last_attempted_on to current datetime
    await bulkUpdateUserQuestQuestionAttempt(updatedData);
    // Update UserQuestAttempt to set 'submitted' to false and last_attempted_on to current datetime
    const updatedUserQuestAttempt = {
      all_questions_submitted: false,
      last_attempted_on: new Date().toISOString()
    }
    await updateUserQuestAttempt(updatedUserQuestAttempt);
    setStatus({ type: 'success', message: 'Save Successful.' });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const updatedData = setScoreAchievedSubmittedLastAttemptedOn(data);
    logger.debug("Submit button clicked, graded attempts ", updatedData);
    // Update UserQuestQuestionAttempt to set 'submitted' to true and last_attempted_on to current datetime
    await bulkUpdateUserQuestQuestionAttempt(updatedData);
    // Update UserQuestAttempt to set 'submitted' to true and last_attempted_on to current datetime
    const updatedUserQuestAttempt = {
      all_questions_submitted: true,
      last_attempted_on: new Date().toISOString()
    }
    await updateUserQuestAttempt(updatedUserQuestAttempt);
    setStatus({ type: 'success', message: 'Submit Successful! Redirecting to Quest page...' });
    await refreshUser();
    router.push(`/dashboard/quest/${questId}`);
  };

  const toggleExplanation = (id: number): void => {
    setShowExplanation(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleCheckboxChange = (answerId: number, isChecked: boolean): void => {
    const attemptId = currentAttemptedQuestionsAndAnswers[0].id;
    onDataChange(attemptId, answerId, isChecked);
  };



  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
        </Box>
        <Grid container spacing={4}>

          {currentAttemptedQuestionsAndAnswers.map((attemptedQuestionsAndAnswers) => (
            <Grid key={attemptedQuestionsAndAnswers.id} xs={12} >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardHeader
                  title={`Question ${attemptedQuestionsAndAnswers.question.number.toString()}`}
                  subheader={
                    <Stack direction="row" spacing='6px' sx={{ alignItems: 'center', pt:0.5 }}>
                      <Typography variant="body2">{attemptedQuestionsAndAnswers.question.max_score}</Typography>
                      <Points height={18}/>
                    </Stack>
                }
                  action={
                    attemptedQuestionsAndAnswers.submitted &&
                    attemptedQuestionsAndAnswers.question.answers.some(answer => answer.reason) ? <Button
                        startIcon={showExplanation[attemptedQuestionsAndAnswers.id] ? <EyeClosedIcon /> : <EyeIcon />}
                        onClick={() => { toggleExplanation(attemptedQuestionsAndAnswers.id); }}
                      >
                        {showExplanation[attemptedQuestionsAndAnswers.id] ? 'Hide Explanation' : 'Show Explanation'}
                      </Button> : null
                  }
                />
                <Divider/>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12}>
                      <Typography variant="subtitle1">
                        {attemptedQuestionsAndAnswers.question.text}
                      </Typography>
                    </Grid>
                    {attemptedQuestionsAndAnswers.question.answers.map((answer) => {
                      const isSelected = attemptedQuestionsAndAnswers.selected_answers.find(sa => sa.answer.id === answer.id)?.is_selected || false;

                      return (
                        <Grid key={answer.id} md={6} xs={12} >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={(e) => { handleCheckboxChange(answer.id, e.target.checked); }}
                              />
                            }
                            label={answer.text}
                          />
                          {showExplanation[attemptedQuestionsAndAnswers.id] && answer.reason ? <Typography variant="body2" mt={1}>{answer.reason}</Typography> : null}
                        </Grid>
                      );
                    })}

                    { attemptedQuestionsAndAnswers.submitted ?
                      <Grid xs={12}>
                        <Typography variant="body1" >
                          Score: {parseFloat(attemptedQuestionsAndAnswers.score_achieved.toFixed(2))} / {attemptedQuestionsAndAnswers.question.max_score}
                        </Typography>
                      </Grid>: null
                    }

                  </Grid>

                </CardContent>
                <CardActions sx={{justifyContent: 'flex-end'}}>
                  <Button startIcon={<FloppyDiskIcon/> } variant="outlined" disabled={attemptedQuestionsAndAnswers.submitted} onClick={handleSave} >Save All</Button>
                  <Button endIcon={<PaperPlaneTiltIcon/>} type="submit" disabled={attemptedQuestionsAndAnswers.submitted} variant="contained">Submit All</Button>
                </CardActions>
              </Card>
              {status ?
                <Alert severity={status.type} sx={{marginTop: 2}}>
                  {status.message}
                </Alert> : null
              }
            </Grid>
          ))}


        </Grid>
      </FormGroup>
    </form>
  );
}
