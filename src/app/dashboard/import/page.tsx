"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {ImportCard} from "@/components/dashboard/import/import-card";


export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Import Quest</Typography>
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
      <ImportCard />
    </Stack>
  );
}
