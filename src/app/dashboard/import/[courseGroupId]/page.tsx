"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ImportCard} from "@/components/dashboard/import/import-card";
import type { Question } from '@/types/question';
import {type AggregatedResult, ImportCardQuestion} from "@/components/dashboard/import/import-card-question";
import {ImportCardUserAttempt} from "@/components/dashboard/import/import-card-user-attempt";
import {type Quest} from "@/types/quest";
import {type UserAnswerAttempt} from "@/types/user-answer-attempt";
import {logger} from "@/lib/default-logger";



export default function Page({ params }: { params: { courseGroupId: string } }): React.JSX.Element {

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [newQuestId, setNewQuestId] = React.useState<Quest['id'] | null>(null);

  const [userAnswerAttempts, setUserAnswerAttempts] = React.useState<UserAnswerAttempt[]>([]);
  const [aggregatedResults, setAggregatedResults] = React.useState<AggregatedResult[]>([]);

  const handleQuestions = (q: Question[]): void => {
    setQuestions(q);
    if (q.length > 0) {
      setNewQuestId(q[0].quest_id);
    } else {
      logger.error('No questions found');
    }
  }

  const handleResultAndUserAnswerAttempts = (results: AggregatedResult[], attempts: UserAnswerAttempt[]): void => {
    // To display the aggregated results
    setAggregatedResults(results);
    // To calculate the total score
    setUserAnswerAttempts(attempts)
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Import Quest Attempts</Typography>
          <Typography variant="body2" color="text.secondary">Import external quest conducted during tutorial sessions</Typography>
        </Stack>


      </Stack>
      { questions.length === 0 &&
        <ImportCard courseGroupId={params.courseGroupId} onImportSuccess={handleQuestions}/>
      }

      { questions.length > 0 && newQuestId && aggregatedResults.length === 0 ?
        <ImportCardQuestion
          questions={questions}
          newQuestId={newQuestId}
          onAggregationComplete={handleResultAndUserAnswerAttempts}
        /> : null
      }

      { aggregatedResults.length > 0 && userAnswerAttempts.length > 0 && newQuestId ?
        <ImportCardUserAttempt
          aggregatedResults={aggregatedResults}
          userAnswerAttempts={userAnswerAttempts}
          newQuestId={newQuestId}
        /> : null
      }

    </Stack>
  );
}
