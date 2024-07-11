"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import Typography from "@mui/material/Typography";
import {AxiosError} from "axios";
import type {AxiosResponse} from "axios";
import Select, { type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import type { Course } from "@/types/course";
import type { Quest } from "@/types/quest";
import {useUser} from "@/hooks/use-user";
import {EduquestUser} from "@/types/eduquest-user";
import { FilePlus as FilePlusIcon } from '@phosphor-icons/react/dist/ssr/FilePlus';

interface CourseFormProps {
  onFormSubmitSuccess: () => void;
}

export function QuestForm({onFormSubmitSuccess}: CourseFormProps): React.JSX.Element {
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const [courses, setCourses] = React.useState<Course[]>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const {user} = useUser();
  const [eduquestUser, setEduquestUser] = React.useState<EduquestUser>();

  const getUser = async ({username}: { username: string }): Promise<void> => {
    try {
      const response: AxiosResponse<EduquestUser> = await apiService.get<EduquestUser>(`/api/EduquestUser/${username}`);
      const data: EduquestUser = response.data;
      setEduquestUser(data);
      logger.debug('eduquest user', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>(`/api/Course/`);
      const data: Course[] = response.data;
      setCourses(data);
      logger.debug('courses', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const handleCourseChange = (event: SelectChangeEvent<number>) => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const courseId = Number(event.target.value); // Convert the value to a number
    const course = courses?.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse({
        id: course.id,
        code: course.code,
        name: course.name,
        description: course.description,
        status: course.status,
        term: {
          id: course.term.id,
          name: course.term.name,
          start_date: course.term.start_date,
          end_date: course.term.end_date,
          academic_year: {
            id: course.term.academic_year.id,
            start_year: course.term.academic_year.start_year,
            end_year: course.term.academic_year.end_year
          }
        }
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      from_course: selectedCourse || courses?.[0],
      organiser: eduquestUser
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.post(`/api/Quest/`, newQuest);
      onFormSubmitSuccess();
      logger.debug('Create Success:', response.data);
      setSubmitStatus({type: 'success', message: 'Create Successful'});
    }
    catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      setSubmitStatus({ type: 'error', message: 'Create Failed. Please try again.' });
    }

  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourses();
      if (user?.username) {
        await getUser({ username: user.username });
      }
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, [user]);
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add new quest to the database" title="New Quest" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput defaultValue="" label="Name" name="name" inputRef={questNameRef} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <OutlinedInput defaultValue="" label="Type" name="type" inputRef={questTypeRef} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput defaultValue="" label="Description" name="description" inputRef={questDescriptionRef}/>
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <OutlinedInput defaultValue="" label="Status" name="status" inputRef={questStatusRef} />
              </FormControl>
            </Grid>

          </Grid>
          <Typography sx={{my:3}} variant="h6">Course</Typography>
          {courses && (

            <Grid container spacing={3}>

              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Course ID</InputLabel>
                  <Select defaultValue={courses[0].id} onChange={handleCourseChange} inputRef={questCourseIdRef} label="Course ID" variant="outlined" type="number">
                    {courses.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Course Name</InputLabel>
                  <OutlinedInput value={selectedCourse?.name || courses[0].name} label="Course Name" disabled/>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Course Code</InputLabel>
                  <OutlinedInput value={selectedCourse?.code || courses[0].code}  label="Course Code"  disabled/>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Course Status</InputLabel>
                  <OutlinedInput value={selectedCourse?.status || courses[0].status}  label="Course Status" disabled/>
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Course Description</InputLabel>
                  <OutlinedInput value={selectedCourse?.description || courses[0].description}  label="Course Description" disabled/>
                </FormControl>
              </Grid>


            </Grid>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button endIcon={<FilePlusIcon fontSize="var(--icon-fontSize-md)"/>} type="submit" variant="contained">Add</Button>
        </CardActions>

      </Card>
      {submitStatus && (
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert>
      )}

    </form>
  );
}
