import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { CheckFat as CheckFatIcon} from "@phosphor-icons/react/dist/ssr/CheckFat";
import { AxiosError } from "axios";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import type { UserQuestQuestionAttempt } from '@/types/user-quest-question-attempt';
import type {UserQuestAttempt} from "@/types/user-quest-attempt";
import Box from "@mui/material/Box";
import {useRouter} from "next/navigation";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { setScoreAchievedSubmittedLastAttemptedOn } from "@/components/dashboard/quest/question/attempt/question-attempt-card";
import {authClient} from "@/lib/auth/client";
import {Loading} from "@/components/dashboard/loading/loading";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import Stack from "@mui/material/Stack";
import {useUser} from "@/hooks/use-user";


// eslint-disable-next-line camelcase -- 'all_questions_submitted' is a backend field and must match the API response
export function setAllQuestionsSubmitted(data: UserQuestAttempt[], all_questions_submitted: boolean) : UserQuestAttempt[] {
  return data.map(attempt => ({
    ...attempt,
    // eslint-disable-next-line camelcase -- 'all_questions_submitted' is a backend field and must match the API response
    all_questions_submitted
  }));
}

interface ImportCardUserAttemptProps {
  userQuestQuestionAttempts: UserQuestQuestionAttempt[];
  userQuestAttempts: UserQuestAttempt[];
}


export function ImportCardUserAttempt( { userQuestQuestionAttempts, userQuestAttempts }:ImportCardUserAttemptProps): React.JSX.Element {
  enum LoadingState {
    Idle = "Idle",
    SettingAllAttemptsAsSubmitted = "SettingAllAttemptsAsSubmitted",
    IssuingBadges = 'IssuingBadges',
    SettingQuestAsExpired = 'SettingQuestAsExpired',
  }
  const { checkSession } = useUser();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 1; // Each page will show one card
  const router = useRouter();
  const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.Idle);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const refreshUser = async () : Promise<void> => {
    if (checkSession) {
      await checkSession();
    }
  };

  const bulkUpdateUserQuestQuestionAttempt = async (questionAttempts: UserQuestQuestionAttempt[]): Promise<void> => {
    try {
      setLoadingState(LoadingState.SettingAllAttemptsAsSubmitted);
      const updateUserQuestQuestionAttempt = setScoreAchievedSubmittedLastAttemptedOn(questionAttempts);
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

  const bulkUpdateUserQuestAttempt = async (updatedUserQuestAttempt: UserQuestAttempt[]): Promise<void> => {
    try {
      setLoadingState(LoadingState.IssuingBadges); // not really but backend signal will do it eventually
      const response = await apiService.patch(`/api/UserQuestAttempt/bulk-update/`, updatedUserQuestAttempt);
      if (response.status === 200) {
        logger.debug('Bulk Update UserQuestAttempt Success:', response.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Bulk Update UserQuestAttempt Failed', error.response?.data);
      }
    }
  }

  const setQuestToExpire = async (questId: number): Promise<void> => {
    try {
      setLoadingState(LoadingState.SettingQuestAsExpired);
      const data = { status: 'Expired' };
      const response = await apiService.patch(`/api/Quest/${questId.toString()}/`, data);
      if (response.status === 200) {
        logger.debug('Quest expired:', response.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to expire quest:', error.response?.data);
      }
    } finally {
      setLoadingState(LoadingState.Idle);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      // Update all questions to submitted and assign the score achieved for each question
      await bulkUpdateUserQuestQuestionAttempt(userQuestQuestionAttempts);

      // Update all quest attempts to submitted, let backend handle the calculation of the total_score_achieved
      const updatedUserQuestAttempt = setAllQuestionsSubmitted(userQuestAttempts, true);
      await bulkUpdateUserQuestAttempt(updatedUserQuestAttempt);

      await setQuestToExpire(userQuestQuestionAttempts[0].question.from_quest);
      await refreshUser(); // To update the user's level bar
      logger.debug('Bulk Update both UserQuestAttempt and UserQuestQuestionAttempt Success');
      router.push(`/dashboard/quest/${userQuestQuestionAttempts[0].question.from_quest.toString()}`);
    }
    catch (error: unknown) {
      logger.error('Failed to save data', error);
    }
  }

// Aggregate data to calculate the percentage of each selected answer
  const aggregateData = userQuestQuestionAttempts.reduce<Record<string, Record<string, { count: number, total: number, isCorrect: boolean }>>>((acc, attempt) => {
    attempt.selected_answers.forEach(answer => {
      if (!acc[attempt.question.text]) {
        acc[attempt.question.text] = {};
      }
      if (!acc[attempt.question.text][answer.answer.text]) {
        acc[attempt.question.text][answer.answer.text] = { count: 0, total: 0, isCorrect: answer.answer.is_correct };
      }
      acc[attempt.question.text][answer.answer.text].total += 1;
      if (answer.is_selected) {
        acc[attempt.question.text][answer.answer.text].count += 1;
      }
    });
    return acc;
  }, {});

  const aggregatedResults = Object.entries(aggregateData).map(([questionText, answers]) => ({
    questionText,
    answers: Object.entries(answers).map(([answerText, { count, total, isCorrect }]) => ({
      answerText,
      isCorrect,
      count,
      total,
      percentage: ((count / total) * 100).toFixed(2)
    }))
  }));

  const pageCount = Math.ceil(aggregatedResults.length / rowsPerPage);
  const currentResults = aggregatedResults.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      {currentResults.map((result, index) => (
        <Card key={index}>
          <CardHeader title={`Question: ${result.questionText}`} />
          <Divider />
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{px:'24px'}}>Answer Text</TableCell>
                  <TableCell sx={{px:'24px', width: '20%'}}>Selected / Total</TableCell>
                  <TableCell sx={{px:'24px', width: '30%'}}>Percentage Selected</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.answers.map((answer, idx) => (
                  <TableRow hover key={idx}>
                    <TableCell sx={{px:'24px'}}>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2">{answer.answerText}</Typography>
                       {answer.isCorrect ? <CheckCircleIcon size={20} color="#66bb6a"/> : null}
                      </Stack>
                      </TableCell>
                    <TableCell sx={{px:'24px'}}>{answer.count} / {answer.total}</TableCell>
                    <TableCell sx={{px:'24px'}}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={parseFloat(answer.percentage)} />
                        </Box>
                        <Box sx={{ minWidth: 45 }}>
                          <Typography variant="body2" color="textSecondary">{`${answer.percentage}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>
      ))}

      {loadingState === LoadingState.SettingAllAttemptsAsSubmitted ? <Loading text="Setting all Attempts as 'Submitted'..." /> : null}
      {loadingState === LoadingState.IssuingBadges ? <Loading text="Issuing Badges..." /> : null}
      {loadingState === LoadingState.SettingQuestAsExpired ? <Loading text='Setting Quest as "Expired"...' /> : null}

      <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
        <Button startIcon={<CheckFatIcon/>} type="submit" variant="contained">Grade Attempts</Button>
      </Box>

    </form>
  );
}
