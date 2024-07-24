"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ImportCard} from "@/components/dashboard/import/import-card";
import Alert from "@mui/material/Alert";
import type { Question } from '@/types/question';
import {logger} from "@/lib/default-logger";
import {ImportCardQuestion} from "@/components/dashboard/import/import-card-question";



export default function Page(): React.JSX.Element {

  // const [submitStatus, setSubmitStatus] = React.useState< { type: 'success' | 'error'; message: string } | null>(null);
  //
  // const handleFormSubmissionResult = (status: { type: 'success' | 'error'; message: string }) : void => {
  //   setSubmitStatus(status);
  // }
  const [questions, setQuestions] = React.useState<Question[]>([]);

  const handleQuestions = (q: Question[]) => {
    setQuestions(q);
    logger.debug('Questions:', questions);
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Import Quest Attempts</Typography>
        </Stack>
        {/*<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>*/}
        {/*  <Button startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"  />} variant="contained">*/}
        {/*    Import*/}
        {/*  </Button>*/}
        {/*  <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>*/}
        {/*    {showForm ? 'Close' : 'Create'}*/}
        {/*  </Button>*/}
        {/*</Stack>*/}

      </Stack>
      {/*{showForm && <CourseForm onFormSubmitSuccess={getCourse} />}*/}
      {/*<CourseCard rows={courses} onEnrolledSuccess={getCourse}/>*/}
      { questions.length === 0 &&
        <ImportCard onImportSuccess={handleQuestions}/>
      }

      { questions.length > 0 &&
        <ImportCardQuestion questions={questions}/>
      }


      {/*{submitStatus && (*/}
      {/*  <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>*/}
      {/*    {submitStatus.message}*/}
      {/*  </Alert>*/}
      {/*)}*/}

    </Stack>
  );
}
