"use client"
import * as React from 'react';
// import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import type { Course } from '@/types/course';
import type { Term } from '@/types/term';
import apiService from "@/api/api-service";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import RouterLink from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";

export default function Page({ params }: { params: { id: string } }) : React.JSX.Element {
  const router = useRouter();
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const courseTermNameRef = React.useRef<HTMLInputElement>(null);
  const courseTermStartDateRef = React.useRef<HTMLInputElement>(null);
  const courseTermEndDateRef = React.useRef<HTMLInputElement>(null);
  const [course, setCourse] = React.useState<Course>();
  const [terms, setTerms] = React.useState<Term[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<{
    name: string;
    start_date: string;
    end_date: string;
  } | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const getCourse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course> = await apiService.get<Course>(`/api/Course/${params.id}`);
      const data: Course = response.data;
      setCourse(data);
      logger.debug('course', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getTerms = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Term[]> = await apiService.get<Term[]>(`/api/Term/`);
      const data: Term[] = response.data;
      setTerms(data);
      logger.debug('terms', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const handleTermChange = (event: SelectChangeEvent<number>) => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const termId = Number(event.target.value); // Convert the value to a number
    const term = terms?.find(t => t.id === termId);
    if (term) {
      setSelectedTerm({
        name: term.name,
        start_date: term.start_date,
        end_date: term.end_date,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedCourse = {
      code: courseCodeRef.current?.value,
      name: courseNameRef.current?.value,
      description: courseDescriptionRef.current?.value,
      status: courseStatusRef.current?.value,
      term: {
        id: courseTermIdRef.current?.value,
        name: courseTermNameRef.current?.value,
        start_date: courseTermStartDateRef.current?.value,
        end_date: courseTermEndDateRef.current?.value
      }
    };

    try {
      const response: AxiosResponse<Course> = await apiService.patch(`/api/Course/${params.id}/`, updatedCourse);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
    } catch (error) {
      logger.error('Submit Error:', error);
      setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });

    }

  };

  const handleDeleteCourse = async () => {
    try {
      await apiService.delete(`/api/Course/${params.id}`);

      router.push(paths.dashboard.course);
    } catch (error) {
      logger.error('Failed to delete the course', error);
      setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourse();
      await getTerms();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (

    <form onSubmit={handleSubmit}>
      {course && (
      <Card>
        <CardHeader subheader="The information can be edited" title="Course"/>
        <Divider/>

        <CardContent>

            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course ID</InputLabel>
                  <OutlinedInput defaultValue={course.id} label="Course ID" name="id" disabled/>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course Code</InputLabel>
                  <OutlinedInput defaultValue={course.code} label="Course Code" inputRef={courseCodeRef} name="code"/>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course Name</InputLabel>
                  <OutlinedInput defaultValue={course.name} label="Course Name" inputRef={courseNameRef} name="name"/>
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course Description</InputLabel>
                  <OutlinedInput defaultValue={course.description} label="Course Description" inputRef={courseDescriptionRef} name="description"/>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course Status</InputLabel>
                  <OutlinedInput defaultValue={course.status} label="Course Status" inputRef={courseStatusRef} name="status"/>
                </FormControl>
              </Grid>
            </Grid>

          <Typography sx={{my:3}} variant="h6">Term</Typography>
        {terms && (

          <Grid container spacing={3}>

          <Grid md={3} xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Term ID</InputLabel>
              <Select defaultValue={course.term.id} onChange={handleTermChange} inputRef={courseTermIdRef} label="Term ID" variant="outlined" type="number">
                {terms.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid md={3} xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Term Name</InputLabel>
              <OutlinedInput value={selectedTerm?.name || course.term.name} inputRef={courseTermNameRef} label="Term Name" disabled/>
            </FormControl>
          </Grid>
          <Grid md={3} xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Term Start Date</InputLabel>
              <OutlinedInput value={selectedTerm?.start_date || course.term.start_date} inputRef={courseTermStartDateRef} label="Term Start Date" type="date" disabled/>
            </FormControl>
          </Grid>
            <Grid md={3} xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Term End Date</InputLabel>
              <OutlinedInput value={selectedTerm?.end_date || course.term.end_date} inputRef={courseTermEndDateRef} label="Term End Date" type="date" disabled/>
            </FormControl>
          </Grid>
          </Grid>
        )}
        </CardContent>

        <Divider/>
        <CardActions sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon/>} component={RouterLink} href={paths.dashboard.course}>Back to Courses</Button>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteCourse}>Delete Course</Button>
            <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Course</Button>
          </Stack>

        </CardActions>
      </Card>
      )}

      {submitStatus && (
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert>
      )}

    </form>
  );
}
