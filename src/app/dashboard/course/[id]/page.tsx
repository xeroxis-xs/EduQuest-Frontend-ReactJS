"use client"
import * as React from 'react';
// import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
//
// import { CourseFilters } from '@/components/dashboard/course/course-filters';
// import { CourseTable } from '@/components/dashboard/course/course-table';
import type { Course } from '@/types/course';
import apiService from "@/api/api-service";
import { type AxiosResponse } from "axios";
import { logger } from '@/lib/default-logger'
// import { authClient } from "@/lib/auth/client";
// import { CourseForm } from "@/components/dashboard/course/course-form";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";

export default function Page({ params }: { params: { id: string } }) : React.JSX.Element {
  // const router = useRouter();
  // const { id } = router.query;

  const [course, setCourse] = React.useState<Course>();

  const getCourse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course> = await apiService.get<Course>(`/api/Course/${params.id}`);
      const data: Course = response.data;
      setCourse(data);
      logger.debug('data', data);
    } catch (error: unknown) {
      logger.error('Failed to fetch data', error);
      // await authClient.signInWithMsal();
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourse();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (

    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Course"/>
        <Divider/>
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Course ID</InputLabel>
                <OutlinedInput defaultValue={course?.id} label="Course ID" name="id"/>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName"/>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email"/>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel"/>
              </FormControl>
            </Grid>
            {/*<Grid md={6} xs={12}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel>State</InputLabel>*/}
            {/*    <Select defaultValue="New York" label="State" name="state" variant="outlined">*/}
            {/*      {states.map((option) => (*/}
            {/*        <MenuItem key={option.value} value={option.value}>*/}
            {/*          {option.label}*/}
            {/*        </MenuItem>*/}
            {/*      ))}*/}
            {/*    </Select>*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City"/>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}
