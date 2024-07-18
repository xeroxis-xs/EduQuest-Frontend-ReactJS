"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
// import type { Question } from '@/types/question';
import CardHeader from "@mui/material/CardHeader";
// import Chip from "@mui/material/Chip";
// import {Answer} from "@/types/answer";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { PaperPlaneTilt as PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import {Divider} from "@mui/material";
// import type {Quest} from "@/types/quest";
// import apiService from "@/api/api-service";
// import {logger} from "@/lib/default-logger";
// import {authClient} from "@/lib/auth/client";
// import {Trash as TrashIcon} from "@phosphor-icons/react/dist/ssr/Trash";
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

function removeQuestionField(data: UserQuestQuestionAttempt[]) {
  return data.map(attempt => ({
    ...attempt,
    selected_answers: attempt.selected_answers.map(sa => ({
      ...sa,
      answer: { ...sa.answer, question: undefined } // Remove the question field
    })),
    question: {
      ...attempt.question,
      answers: attempt.question.answers.map(ans => ({
        ...ans,
        question: undefined // Remove the question field
      }))
    }
  }));
}

function setSubmitted(data: UserQuestQuestionAttempt[], submitted: boolean) {
  return data.map(attempt => ({
    ...attempt,
    submitted
  }));

}

/* eslint-disable camelcase -- Disabling camelcase rule because the API response uses snake_case, and we need to match those property names exactly. */
function calculateScore(data: UserQuestQuestionAttempt): number {

  const { selected_answers, question } = data;
  const total_answers = question.answers;

  const num_correct = total_answers.filter(answer => answer.is_correct).length;
  const num_incorrect = total_answers.length - num_correct;

  const num_correct_selected = selected_answers.filter(answer => answer.is_selected && answer.answer.is_correct).length;
  const num_incorrect_selected = selected_answers.filter(answer => answer.is_selected && !answer.answer.is_correct).length;

  if (num_correct_selected === 0 && num_incorrect_selected > 0) {
    return 0;
  }

  // Calculate the score
  const correct_score = num_correct > 0 ? num_correct_selected / num_correct : 0;
  const penalty = num_incorrect > 0 ? num_incorrect_selected / num_incorrect : 0;

  // Use the question's max_score to determine the final score achieved
  const score_achieved = correct_score * (1 - penalty) * question.max_score;

  return score_achieved;
}
/* eslint-enable camelcase -- Enabling rule back*/

function calculateScoresForData(data: UserQuestQuestionAttempt[]): UserQuestQuestionAttempt[] {
  return data.map(userQuestQuestionAttempt => {
    const score = calculateScore(userQuestQuestionAttempt);
    return {
      ...userQuestQuestionAttempt,
      score_achieved: score
    };
  });
}

export function QuestionAttemptCard({ data = [], onDataChange, onSubmitResult, onSaveResult }: QuestionAttemptCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 1;
  // Calculate the number of pages
  const pageCount = Math.ceil(data.length / rowsPerPage);
  // Calculate the items to be displayed on the current page
  const currentAttemptedQuestionsAndAnswers = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleCheckboxChange = (answerId: number, isChecked: boolean) => {
    // Assuming you have access to the attempt ID or can derive it from the current context
    const attemptId = currentAttemptedQuestionsAndAnswers[0].id;
    // Call the function passed as prop with the necessary parameters
    onDataChange(attemptId, answerId, isChecked);
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const modifiedData = removeQuestionField(data);
    logger.debug("Save button clicked, updated data: ", modifiedData);

    try {
      const response = await apiService.patch(`/api/UserQuestQuestionAttempt/bulk-update/`, modifiedData);
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
    const calculatedData = calculateScoresForData(data);
    const submittedData = setSubmitted(calculatedData, true);
    const modifiedData = removeQuestionField(submittedData);
    logger.debug("Submit button clicked, updated data ", modifiedData);

    // Update UserQuestQuestionAttempt to set 'submitted' to true
    try {
      const response = await apiService.patch(`/api/UserQuestQuestionAttempt/bulk-update/`, modifiedData);
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
            <CardHeader title={`Question ${attemptedQuestionsAndAnswers.question.number.toString()}` } subheader={`${attemptedQuestionsAndAnswers.question.max_score.toString()} point(s)` }/>
            <Divider/>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <Typography variant="subtitle1">
                      {attemptedQuestionsAndAnswers.question.text}
                    </Typography>
                  </Grid>
                  {attemptedQuestionsAndAnswers.question.answers.map((answer) => {
                    // Assuming each answer has a unique ID and selected_answers contains objects with an answer property that includes the ID
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
