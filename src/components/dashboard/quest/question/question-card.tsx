import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import type { Question } from '@/types/question';
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import {Answer} from "@/types/answer";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {AxiosError, AxiosResponse} from "axios";
import type {Quest} from "@/types/quest";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {authClient} from "@/lib/auth/client";


interface QuestiontCardProps {
  questions?: Question[];
  answers?: Answer[];
}

export function QuestionCard({ questions = [], answers = []
                           }: QuestiontCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 1;
  // Calculate the number of pages
  const pageCount = Math.ceil(questions.length / rowsPerPage);
  // Calculate the items to be displayed on the current page
  const currentQuestions = questions.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const newQuest = {
    //   type: questTypeRef.current?.value,
    //   name: questNameRef.current?.value,
    //   description: questDescriptionRef.current?.value,
    //   status: questStatusRef.current?.value,
    //   from_course: selectedCourse || courses?.[0],
    //   organiser: eduquestUser
    // };
    //
    // try {
    //   const response: AxiosResponse<Quest> = await apiService.post(`/api/Quest/`, newQuest);
    //   onFormSubmitSuccess();
    //   logger.debug('Create Success:', response.data);
    //   setSubmitStatus({type: 'success', message: 'Create Successful'});
    // }
    // catch (error: unknown) {
    //   if (error instanceof AxiosError) {
    //     if (error.response?.status === 401) {
    //       await authClient.signInWithMsal();
    //     }
    //     else {
    //       logger.error('Code: ', error.response?.status);
    //       logger.error('Message: ', error.response?.data);
    //     }
    //   }
    //   setSubmitStatus({ type: 'error', message: 'Create Failed. Please try again.' });
    // }

  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      <Grid container spacing={4}>

      {currentQuestions.map((question) => (
        <Grid key={question.id} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardHeader title={`Question ${question?.number.toString()}`}/>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <Typography variant="subtitle2">
                      {question.text}
                    </Typography>
                  </Grid>
                {answers.map((answer) => (
                  answer.question === question.id && (
                    <Grid key={answer.id} md={6} xs={12}>
                      <FormControlLabel control={<Checkbox defaultChecked />} label={answer.text} />
                    </Grid>
                  )
                ))}
                </Grid>

              </CardContent>
            <CardActions>
              <Button variant="contained">Save</Button>
              <Button type="submit" variant="contained">Submit All</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}


    </Grid>
    </FormGroup>
    </form>
  );
}
