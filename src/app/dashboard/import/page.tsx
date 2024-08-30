"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ImportCard} from "@/components/dashboard/import/import-card";
import type { Question } from '@/types/question';
import {logger} from "@/lib/default-logger";
import {ImportCardQuestion} from "@/components/dashboard/import/import-card-question";
import type {UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import {ImportCardUserAttempt} from "@/components/dashboard/import/import-card-user-attempt";
import type {UserQuestAttempt} from "@/types/user-quest-attempt";



export default function Page(): React.JSX.Element {

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [userQuestQuestionAttempts, setUserQuestQuestionAttempts] = React.useState<UserQuestQuestionAttempt[]>([]);
  const [userQuestAttempts, setUserQuestAttempts] = React.useState<UserQuestAttempt[]>([]);


  const handleQuestions = (q: Question[]): void => {
    setQuestions(q);
    logger.debug('Questions:', questions);
  }

  const handleQuestQuestionAttemptsUpdate = (updatedQuestQuestionAttempts: UserQuestQuestionAttempt[]): void => {
    setUserQuestQuestionAttempts(updatedQuestQuestionAttempts);
  }

  const handleQuestAttemptsUpdate = (updatedUserQuestAttempts: UserQuestAttempt[]): void => {
    setUserQuestAttempts(updatedUserQuestAttempts);
  }



  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Import Quest Attempts</Typography>
        </Stack>


      </Stack>
      { questions.length === 0 &&
        <ImportCard courseId={null} onImportSuccess={handleQuestions}/>
      }

      { questions.length > 0 && userQuestQuestionAttempts.length === 0 &&
        <ImportCardQuestion
          questions={questions}
          onQuestQuestionAttemptsUpdate={handleQuestQuestionAttemptsUpdate}
          onQuestAttemptsUpdate={handleQuestAttemptsUpdate}
        />
      }

      { userQuestQuestionAttempts.length > 0 && userQuestAttempts.length > 0 &&
        <ImportCardUserAttempt userQuestQuestionAttempts={userQuestQuestionAttempts} userQuestAttempts={userQuestAttempts}/>
      }


    </Stack>
  );
}
