import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { CheckFat as CheckFatIcon} from "@phosphor-icons/react/dist/ssr/CheckFat";
import {logger} from "@/lib/default-logger";
import Box from "@mui/material/Box";
import {useRouter} from "next/navigation";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import {Loading} from "@/components/dashboard/loading/loading";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import Stack from "@mui/material/Stack";
import {useUser} from "@/hooks/use-user";
import {type AggregatedResult} from "@/components/dashboard/import/import-card-question";
import {type UserAnswerAttempt} from "@/types/user-answer-attempt";
import {updateUserQuestAttemptByQuestAsSubmitted} from "@/api/services/user-quest-attempt";
import {type Quest} from "@/types/quest";
import {updateQuest} from "@/api/services/quest";


interface ImportCardUserAttemptProps {
  userAnswerAttempts: UserAnswerAttempt[];
  aggregatedResults: AggregatedResult[];
  newQuestId: Quest['id'];
}


export function ImportCardUserAttempt( { aggregatedResults, newQuestId }:ImportCardUserAttemptProps): React.JSX.Element {
  enum LoadingState {
    Idle = "Idle",
    CalculatingScores = "CalculatingScores",
    IssuingBadges = 'IssuingBadges',
    SettingQuestAsExpired = 'SettingQuestAsExpired',
    IssuingPoints = 'IssuingPoints',
    Redirecting = 'Redirecting',
  }
  const { checkSession } = useUser();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 1; // Each page will show one card
  const router = useRouter();
  const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.Idle);
  const delay = (ms: number): Promise<void> => new Promise(resolve => {setTimeout(resolve, ms)});

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const refreshUser = async () : Promise<void> => {
    try {
      setLoadingState(LoadingState.IssuingPoints);
      if (checkSession) {
        await checkSession();
      }
    } catch (error: unknown) {
      logger.error('Failed to refresh user:', error);
    } finally {
      setLoadingState(LoadingState.Redirecting);
    }

  };
  const setAttemptsAsSubmitted = async (questId: Quest['id']): Promise<void> => {
    try {
      setLoadingState(LoadingState.IssuingBadges);
      await updateUserQuestAttemptByQuestAsSubmitted(questId.toString());
      // logger.debug('All attempts set as submitted');
    } catch (error: unknown) {
      logger.error('Failed to set all attempts as submitted:', error);
    }
  }

  const setQuestToExpire = async (questId: number): Promise<void> => {
    try {
      setLoadingState(LoadingState.SettingQuestAsExpired);
      const data = { status: 'Expired' };
      await updateQuest(questId.toString(), data);
      // logger.debug('Quest set as expired:');
    } catch (error: unknown) {
      logger.error('Failed to expire quest:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {

      // 2. Set all attempts for the quest as submitted
      await setAttemptsAsSubmitted(newQuestId);

      // Insert a 5-second blocking timer
      await delay(5000);

      // 3. Set the quest as expired
      await setQuestToExpire(newQuestId);

      // 4. Refresh the user's level bar
      await refreshUser();

      // 5. Redirect to the quest page
      router.push(`/dashboard/quest/${newQuestId.toString()}`);
    }
    catch (error: unknown) {
      logger.error('Failed to save data', error);
    }
  }

  const pageCount = Math.ceil(aggregatedResults.length / rowsPerPage);
  const currentResults = aggregatedResults.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      {currentResults.map((result, index) => (
        <Card key={index}>
          <CardHeader title={`Question ${result.questionNumber.toString()}. ${result.questionText}`} />
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

      {loadingState === LoadingState.CalculatingScores ? <Loading text="Calculating Scores all Attempts..." /> : null}
      {loadingState === LoadingState.IssuingBadges ? <Loading text="Checking Conditions and Issuing Badges..." /> : null}
      {loadingState === LoadingState.SettingQuestAsExpired ? <Loading text='Setting Quest as Expired...' /> : null}
      {loadingState === LoadingState.IssuingPoints ? <Loading text='Issuing Points...' /> : null}
      {loadingState === LoadingState.Redirecting ? <Loading text='Completed! Redirecting...' /> : null}

      <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
        <Button startIcon={<CheckFatIcon/>} type="submit" variant="contained">Grade Attempts</Button>
      </Box>

    </form>
  );
}
