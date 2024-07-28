"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import apiService from "@/api/api-service";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import type { UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import { QuestionAttemptCard } from "@/components/dashboard/quest/question/attempt/question-attempt-card";
import Alert from "@mui/material/Alert";


export default function Page({ params }: { params: { userQuestAttemptId: string, questId: string } }) : React.JSX.Element {
  const router = useRouter();

  const [attemptedQuestionsAndAnswers, setAttemptedQuestionsAndAnswers] = React.useState<UserQuestQuestionAttempt[]>();
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };


  const getAttemptedQuestionsAndAnswers = async (): Promise<void> => {
    try {
      const response: AxiosResponse<UserQuestQuestionAttempt[]> = await apiService.get<UserQuestQuestionAttempt[]>(`/api/UserQuestQuestionAttempt/by-user-quest-attempt/${params.userQuestAttemptId}`);
      const data: UserQuestQuestionAttempt[] = response.data;
      setAttemptedQuestionsAndAnswers(data);
      logger.debug('UserQuestQuestionAttempt', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const updateUserQuestAttempt = async (updatedUserQuestAttempt: { all_questions_submitted:boolean, last_attempted_on:string}): Promise<void> => {
    try {
      const response = await apiService.patch(`/api/UserQuestAttempt/${params.userQuestAttemptId}/`, updatedUserQuestAttempt);
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

  const handleSubmitResult = async (status: { type: 'success' | 'error'; message: string }) : Promise<void> => {
    if (status.type === 'success') {
      setSubmitStatus(status);
      const updatedUserQuestAttempt = {
        all_questions_submitted: true,
        last_attempted_on: new Date().toISOString(),
      }
      // Update UserQuestAttempt to set 'submitted' to true and last_attempted_on to current datetime
      await updateUserQuestAttempt(updatedUserQuestAttempt);
      router.push(`/dashboard/quest/${params.questId}`);
    }

    else {
      setSubmitStatus(status);
    }
  }

  const handleSaveResult = async (status: { type: 'success' | 'error'; message: string }): Promise<void> => {
    if (status.type === 'success') {
      setSaveStatus(status);
      const updatedUserQuestAttempt = {
        all_questions_submitted: false,
        last_attempted_on: new Date().toISOString(),
      }
      // Update UserQuestAttempt to set 'submitted' to false and last_attempted_on to current datetime
      await updateUserQuestAttempt(updatedUserQuestAttempt);
    }
    else {
      setSaveStatus(status);
    }
  }

  const handleDataChange = (attemptId: number, answerId: number, isChecked: boolean) => {
    if (attemptedQuestionsAndAnswers) {
      const newData = attemptedQuestionsAndAnswers.map((attempt : UserQuestQuestionAttempt) => {
        if (attempt.id === attemptId) {
          return {
            ...attempt,
            selected_answers: attempt.selected_answers.map((selectedAnswer) => {
              if (selectedAnswer.answer.id === answerId) {
                return {...selectedAnswer, is_selected: isChecked};
              }
              return selectedAnswer;
            }),
          };
        }
        return attempt;
      });
      logger.debug('Updated data:', newData);
      setAttemptedQuestionsAndAnswers(newData);
    }

  };


  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getAttemptedQuestionsAndAnswers();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      {attemptedQuestionsAndAnswers && attemptedQuestionsAndAnswers.length > 0 &&
        <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} href={`/dashboard/quest/${params.questId}`}>Return to Quest</Button>
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Question'}
        </Button>
      </Stack>
      }

      <QuestionAttemptCard
        data={attemptedQuestionsAndAnswers}
        onDataChange={handleDataChange}
        onSubmitResult={handleSubmitResult}
        onSaveResult={handleSaveResult}
      />

      {submitStatus && (
        <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
          {submitStatus.message}
        </Alert>
      )}

      {saveStatus && (
        <Alert severity={saveStatus.type} sx={{marginTop: 2}}>
          {saveStatus.message}
        </Alert>
      )}
    </Stack>


  );
}
