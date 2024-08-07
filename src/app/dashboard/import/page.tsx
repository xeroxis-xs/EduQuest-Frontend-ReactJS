"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ImportCard} from "@/components/dashboard/import/import-card";
import type { Question } from '@/types/question';
import {logger} from "@/lib/default-logger";
import {ImportCardQuestion} from "@/components/dashboard/import/import-card-question";
import type {UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import apiService from "@/api/api-service";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import {ImportCardUserAttempt} from "@/components/dashboard/import/import-card-user-attempt";
import type {UserQuestAttempt} from "@/types/user-quest-attempt";



export default function Page(): React.JSX.Element {

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [userQuestQuestionAttempts, setUserQuestQuestionAttempts] = React.useState<UserQuestQuestionAttempt[]>([]);
  const [userQuestAttempts, setUserQuestAttempts] = React.useState<UserQuestAttempt[]>([]);

  const handleQuestions = (q: Question[]) => {
    setQuestions(q);
    logger.debug('Questions:', questions);
  }

  const getQuestQuestionAttempts = async (questId:number) => {
    try {
      const response = await apiService.get<UserQuestQuestionAttempt[]>(`/api/UserQuestQuestionAttempt/by-quest/${questId.toString()}`);
      const data: UserQuestQuestionAttempt[] = response.data;
      setUserQuestQuestionAttempts(data);
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

  const getQuestAttempts = async (questId:number) => {
    try {
      const response = await apiService.get<UserQuestAttempt[]>(`/api/UserQuestAttempt/by-quest/${questId.toString()}`);
      const data: UserQuestAttempt[] = response.data;
      setUserQuestAttempts(data);
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

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Import Quest Attempts</Typography>
        </Stack>


      </Stack>
      { questions.length === 0 &&
        <ImportCard onImportSuccess={handleQuestions}/>
      }

      { questions.length > 0 && userQuestQuestionAttempts.length === 0 &&
        <ImportCardQuestion
          questions={questions}
          onQuestionUpdateSuccess={async (questId: number) => {
            await getQuestQuestionAttempts(questId);
            await getQuestAttempts(questId);
          }}
        />
      }

      { userQuestQuestionAttempts.length > 0 && userQuestAttempts.length > 0 &&
        <ImportCardUserAttempt userQuestQuestionAttempts={userQuestQuestionAttempts} userQuestAttempts={userQuestAttempts}/>
      }


    </Stack>
  );
}
