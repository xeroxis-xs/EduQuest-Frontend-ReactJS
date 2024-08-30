import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { AxiosError } from "axios";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {authClient} from "@/lib/auth/client";
import type { Question } from '@/types/question';
import Box from "@mui/material/Box";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Loading} from "@/components/dashboard/loading/loading";
import {UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import {UserQuestAttempt} from "@/types/user-quest-attempt";


interface ImportCardQuestionProps {
  questions: Question[];
  onQuestQuestionAttemptsUpdate: (updatedQuestQuestionAttempts: UserQuestQuestionAttempt[]) => void;
  onQuestAttemptsUpdate: (updatedUserQuestAttempts: UserQuestAttempt[]) => void;
}

export function ImportCardQuestion({ questions, onQuestQuestionAttemptsUpdate, onQuestAttemptsUpdate }: ImportCardQuestionProps): React.JSX.Element {
  enum LoadingState {
    Idle = "Idle",
    UpdatingQuestions = "UpdatingQuestions",
    GettingUserAttempts = 'GettingUserAttempts',
    ConsolidatingUserAttempts = 'ConsolidatingUserAttempts',
  }
  const [updatedQuestions, setUpdatedQuestions] = React.useState(questions);
  const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.Idle);

  const handleAnswerChange = (questionId: number, answerId: number, isCorrect: boolean): void => {
    logger.debug('handleAnswerChange', questionId, answerId, isCorrect);
    const newQuestions = updatedQuestions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          answers: question.answers.map((answer) => {
            if (answer.id === answerId) {
              return { ...answer, is_correct: isCorrect };
            }
            return answer;
          }),
        };
      }
      return question;
    });
    logger.debug('newQuestions', newQuestions);
    setUpdatedQuestions(newQuestions);
  };

  const bulkUpdateQuestions = async (): Promise<number | undefined> => {
    try {
      setLoadingState(LoadingState.UpdatingQuestions);
      const response = await apiService.patch(`/api/Question/bulk-update/`, updatedQuestions);
      if (response.status === 200) {
        logger.debug('Update Success:', response.data);
        return updatedQuestions[0].from_quest;
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to save data', error);
    }
  }

  const getQuestQuestionAttempts = async (questId:number): Promise<void> => {
    try {
      setLoadingState(LoadingState.GettingUserAttempts);
      const response = await apiService.get<UserQuestQuestionAttempt[]>(`/api/UserQuestQuestionAttempt/by-quest/${questId.toString()}`);
      const data: UserQuestQuestionAttempt[] = response.data;
      onQuestQuestionAttemptsUpdate(data);
      logger.debug('UserQuestQuestionAttempt', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error getting UserQuestQuestionAttempt: ', error);
    }
  };

  const getQuestAttempts = async (questId:number): Promise<void> => {
    try {
      setLoadingState(LoadingState.ConsolidatingUserAttempts);
      const response = await apiService.get<UserQuestAttempt[]>(`/api/UserQuestAttempt/by-quest/${questId.toString()}`);
      const data: UserQuestAttempt[] = response.data;
      onQuestAttemptsUpdate(data);
      logger.debug('UserQuestAttempt', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error getting UserQuestAttempt: ', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const questId = await bulkUpdateQuestions();
    if (questId) {
      await getQuestQuestionAttempts(questId);
      await getQuestAttempts(questId);
    }



  }

  return (
    <form onSubmit={handleSubmit}>
    <Card>
      <CardHeader title="Update Question" subheader="Select the correct answer for each question"/>
      <Divider/>

      <CardContent sx={{pb:'16px'}}>

        <Grid container spacing={5} >

          {updatedQuestions.map((question) => (
            <Grid container key={question.id} spacing={1} sx={{width: '100%'}}>
              <Grid xs={12}>
                <Typography variant="h6" sx={{mb:2}}>{question.number}. {question.text}</Typography>
              </Grid>

              {question.answers.map((answer) => (
                <Grid key={answer.id} md={6} xs={12}>
                  {/*<FormGroup>*/}
                    <FormControlLabel
                      // key={answer.id}
                      control={
                        <Checkbox
                          checked={answer.is_correct}
                          onChange={(e) => { handleAnswerChange(question.id, answer.id, e.target.checked); }}
                        />
                      }
                      label={answer.text}
                    />
                  {/*</FormGroup>*/}
                </Grid>
              ))}

            </Grid>
          ))}
        </Grid>

      </CardContent>
    </Card>

      {loadingState === LoadingState.UpdatingQuestions ? <Loading text="Updating Questions..." /> : null}
      {loadingState === LoadingState.GettingUserAttempts ? <Loading text="Getting User Attempts..." /> : null}
      {loadingState === LoadingState.ConsolidatingUserAttempts ? <Loading text="Consolidating User Attempts..." /> : null}


    <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
      <Button endIcon={<CaretRightIcon/>} type="submit" variant="contained">Next: View Attempts</Button>
    </Box>

      </form>
    // {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
    //   {submitStatus.message}
    // </Alert> : null}

  );
}
