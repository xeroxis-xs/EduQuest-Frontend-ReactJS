"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import type { Question } from '@/types/question';
import type { Quest } from '@/types/quest';
import apiService from "@/api/api-service";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import Stack from "@mui/material/Stack";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import {QuestionCard} from "@/components/dashboard/quest/question/question-card";


export default function Page({ params }: { params: { questId: string } }) : React.JSX.Element {
  const [quest, setQuest] = React.useState<Quest>();
  const [questionsAndAnswers, setQuestionsAndAnswers] = React.useState<Question[]>();
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getQuest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Quest> = await apiService.get<Quest>(`/api/Quest/${params.questId}`);
      const data: Quest = response.data;
      setQuest(data);
      logger.debug('quest', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };


  const getQuestionsAndAnswers = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Question[]> = await apiService.get<Question[]>(`/api/Question/by-quest/${params.questId}`);
      const data: Question[] = response.data;
      setQuestionsAndAnswers(data);
      logger.debug('question', data);
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
    logger.debug(params.questId)
    const fetchData = async (): Promise<void> => {
      await getQuest();
      // await getAnswers();
      await getQuestionsAndAnswers();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  });


  return (
    <Stack spacing={3}>
      {quest ?
        <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} href={`/dashboard/quest/${quest?.id.toString()}`}>Return to Quest {quest?.name} </Button>
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Question'}
        </Button>
      </Stack> : null
      }

      <QuestionCard questionsAndAnswers={questionsAndAnswers}/>

    </Stack>


  );
}
