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
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import type { UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import { QuestionAttemptCard } from "@/components/dashboard/quest/question/attempt/question-attempt-card";


export default function Page({ params }: { params: { userQuestAttemptId: string, questId: string } }) : React.JSX.Element {

  const [attemptedQuestionsAndAnswers, setAttemptedQuestionsAndAnswers] = React.useState<UserQuestQuestionAttempt[]>();
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const handleDataChange = (attemptId: number, answerId: number, isChecked: boolean): void => {
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
      {attemptedQuestionsAndAnswers && attemptedQuestionsAndAnswers.length > 0 ?
        <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} href={`/dashboard/quest/${params.questId}`}>Return to Quest</Button>
          <Button
            startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />}
            variant={showForm ? 'text' : 'contained'}
            color={showForm ? 'error' : 'primary'}
            onClick={toggleForm}
          >
            {showForm ? 'Cancel' : 'Edit Question'}
          </Button>
      </Stack> : null
      }

      <QuestionAttemptCard
        data={attemptedQuestionsAndAnswers}
        onDataChange={handleDataChange}
        // onSubmitResult={handleSubmitResult}
        // onSaveResult={handleSaveResult}
        questId={params.questId}
        userQuestAttemptId={params.userQuestAttemptId}
      />


    </Stack>


  );
}
