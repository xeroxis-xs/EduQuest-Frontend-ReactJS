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


interface QuestionAttemptCardProps {
  data?: UserQuestQuestionAttempt[];
  onDataChange: (attemptId: number, answerId: number, isChecked: boolean) => void;
  onSubmitResult: (status: { type: 'success' | 'error'; message: string }) => void;
  onSaveResult: (status: { type: 'success' | 'error'; message: string }) => void;
}


export function setSubmitted(data: UserQuestQuestionAttempt[], submitted: boolean) : UserQuestQuestionAttempt[] {
  return data.map(attempt => ({
    ...attempt,
    submitted
  }));
}

export function setLastAttemptedOn(data: UserQuestQuestionAttempt[]) : UserQuestQuestionAttempt[] {
  return data.map(attempt => ({
    ...attempt,
    last_attempted_on: new Date().toISOString()
  }));
}


export function QuestionAttemptCard({ data = [], onDataChange, onSubmitResult, onSaveResult }: QuestionAttemptCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const [showExplanation, setShowExplanation] = React.useState<Record<number, boolean>>({});
  const rowsPerPage = 1;
  const pageCount = Math.ceil(data.length / rowsPerPage);
  const currentAttemptedQuestionsAndAnswers = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleCheckboxChange = (answerId: number, isChecked: boolean) => {
    const attemptId = currentAttemptedQuestionsAndAnswers[0].id;
    onDataChange(attemptId, answerId, isChecked);
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const updatedData = setLastAttemptedOn(data);
    logger.debug("Save button clicked, updated data: ", updatedData);

    try {
      const response = await apiService.patch(`/api/UserQuestQuestionAttempt/bulk-update/`, updatedData);
      if (response.status === 200) {
        logger.debug('Update Success:', response.data);
        onSaveResult({ type: 'success', message: 'Save Successful' });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to save data', error);
      onSaveResult({ type: 'error', message: 'Save Failed. Please try again.' });
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedData = setLastAttemptedOn(data);
    const submittedData = setSubmitted(updatedData, true);
    logger.debug("Submit button clicked, updated data ", submittedData);

    try {
      const response = await apiService.patch(`/api/UserQuestQuestionAttempt/bulk-update/`, submittedData);
      if (response.status === 200) {
        logger.debug('Submit Success:', response.data);
        onSubmitResult({ type: 'success', message: 'Submit Successful' });
      }
    }
    catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to submit data', error);
      onSubmitResult({ type: 'error', message: 'Submit Failed. Please try again.' });
    }
  };

  const toggleExplanation = (id: number) => {
    setShowExplanation(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
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
                  subheader={`${attemptedQuestionsAndAnswers.question.max_score.toString()} point(s)`}
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
            </Grid>
          ))}


        </Grid>
      </FormGroup>
    </form>
  );
}
