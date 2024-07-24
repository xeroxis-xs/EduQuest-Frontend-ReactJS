import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Quest } from '@/types/quest';
import CardHeader from "@mui/material/CardHeader";
import {CardMedia} from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {FloppyDisk as FloppyDiskIcon} from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import {CaretRight as CaretRightIcon} from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CloudArrowUp as CloudArrowUpIcon } from "@phosphor-icons/react/dist/ssr/CloudArrowUp";
import {AxiosError, type AxiosResponse} from "axios";
import type {Course} from "@/types/course";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {authClient} from "@/lib/auth/client";
import type {Image} from "@/types/image";
import {styled} from "@mui/material/styles";
import {useUser} from "@/hooks/use-user";
import type { Question } from '@/types/question';
import Box from "@mui/material/Box";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from "@mui/material/Alert";





export function ImportCardQuestion({questions}: {questions: Question[]}): React.JSX.Element {

  const [updatedQuestions, setUpdatedQuestions] = React.useState(questions);

  const handleAnswerChange = (questionId: number, answerId: number, isCorrect: boolean) => {
    const newQuestions = updatedQuestions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          answers: question.answers.map((answer) => {
            if (answer.id === answerId) {
              return { ...answer, is_correct: isCorrect };
            }
            return answer;
          }),
        };
      }
      return question;
    });
    setUpdatedQuestions(newQuestions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logger.debug('Submitting updated questions', updatedQuestions);

    try {
      const response = await apiService.patch(`/api/Question/bulk-update/`, updatedQuestions);
      if (response.status === 200) {
        logger.debug('Update Success:', response.data);
        // onSaveResult({ type: 'success', message: 'Save Successful' });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to save data', error);
      // onSaveResult({ type: 'error', message: 'Save Failed. Please try again.' });
    }
  }

  // React.useEffect(() => {
  //   const fetchData = async (): Promise<void> => {
  //
  //   };
  //
  //   fetchData().catch((error: unknown) => {
  //     logger.error('Failed to fetch data', error);
  //   });
  // }, []);

  return (
    <form onSubmit={handleSubmit}>
    <Card>
      <CardHeader title="Update Question" subheader="Select the correct answer for each question"/>
      <Divider/>

      <CardContent sx={{pb:'16px'}}>

        <Grid container spacing={5}>

          {updatedQuestions.map((question) => (
            <Grid container key={question.id} spacing={1} >
              <Grid xs={12}>
                <Typography variant="h6" sx={{mb:2}}>{question.number}. {question.text}</Typography>
              </Grid>

              {question.answers.map((answer) => (
                <Grid key={answer.id} md={6} xs={12}>
                  {/*<FormGroup>*/}
                    <FormControlLabel
                      // key={answer.id}
                      control={
                        <Checkbox
                          checked={answer.is_correct}
                          onChange={(e) => { handleAnswerChange(question.id, answer.id, e.target.checked); }}
                        />
                      }
                      label={answer.text}
                    />
                  {/*</FormGroup>*/}
                </Grid>
              ))}

            </Grid>
          ))}
        </Grid>

      </CardContent>
    </Card>


    <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
      <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Question and Grade Attempts</Button>
    </Box>
      </form>
    // {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
    //   {submitStatus.message}
    // </Alert> : null}

  );
}
