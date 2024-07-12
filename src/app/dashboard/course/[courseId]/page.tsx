"use client"
import * as React from 'react';
// import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import type { Course } from '@/types/course';
import type { Term } from '@/types/term';
import type { Quest } from '@/types/quest';
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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import RouterLink from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import Chip from "@mui/material/Chip";
import {QuestCard} from "@/components/dashboard/quest/quest-card";

export default function Page({ params }: { params: { courseId: string } }) : React.JSX.Element {
  const router = useRouter();
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const [course, setCourse] = React.useState<Course>();
  const [terms, setTerms] = React.useState<Term[]>();
  const [quests, setQuests] = React.useState<Quest[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getCourse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course> = await apiService.get<Course>(`/api/Course/${params.courseId}`);
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

  const getQuests = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Quest[]> = await apiService.get<Quest[]>(`/api/Quest/by-course/${params.courseId}`);
      const data: Quest[] = response.data;
      setQuests(data);
      logger.debug('quests', data);
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
        id: term.id,
        name: term.name,
        start_date: term.start_date,
        end_date: term.end_date,
        academic_year: {
          id: term.academic_year.id,
          start_year: term.academic_year.start_year,
          end_year: term.academic_year.end_year
        }
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
      term: selectedTerm || terms?.[0],
    };

    try {
      const response: AxiosResponse<Course> = await apiService.patch(`/api/Course/${params.courseId}/`, updatedCourse);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      await getCourse();
      setShowForm(false)
    } catch (error) {
      logger.error('Submit Error:', error);
      setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });

    }

  };

  const handleDeleteCourse = async () => {
    try {
      await apiService.delete(`/api/Course/${params.courseId}`);

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
      await getQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={paths.dashboard.course}>View all Courses</Button>
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Course'}
        </Button>
      </Stack>

      {!showForm && course && (
        <Card>
          <CardHeader title="Course Details"/>
          <Divider/>
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course ID</Typography>
                <Typography variant="body2">{course.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Code</Typography>
                <Typography variant="body2">{course.code}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Name</Typography>
                <Typography variant="body2">{course.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Status</Typography>
                <Chip label={course.status} sx={{ mt: 1 }} color="success" size="small"/>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2">Course Description</Typography>
                <Typography variant="body2">{course.description}</Typography>
              </Grid>
            </Grid>
              <Divider sx={{my: 3}}/>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Term ID</Typography>
                <Typography variant="body2">{course.term.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Term Name</Typography>
                <Typography variant="body2">{course.term.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Term Start Date</Typography>
                <Typography variant="body2">{course.term.start_date}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Term End Date</Typography>
                <Typography variant="body2">{course.term.end_date}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Academic Year ID</Typography>
                <Typography variant="body2">{course.term.academic_year.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Academic Year</Typography>
                <Typography variant="body2">AY {course.term.academic_year.start_year}-{course.term.academic_year.end_year}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        {showForm && course && (
          <Card>
            <CardHeader title="Course"/>
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
                    <OutlinedInput defaultValue={course.description} label="Course Description"
                                   inputRef={courseDescriptionRef} name="description"/>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Status</InputLabel>
                    <OutlinedInput defaultValue={course.status} label="Course Status" inputRef={courseStatusRef}
                                   name="status"/>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography sx={{my: 3}} variant="h6">Term</Typography>
              {terms && (

                <Grid container spacing={3}>

                  <Grid md={3} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Term ID</InputLabel>
                      <Select defaultValue={course.term.id} onChange={handleTermChange} inputRef={courseTermIdRef}
                              label="Term ID" variant="outlined" type="number">
                        {terms.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid md={9} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                      <Typography variant="subtitle2">Term Name</Typography>
                      <Typography variant="body2">{selectedTerm?.name || terms[0].name}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Term Start Date</Typography>
                    <Typography variant="body2">{selectedTerm?.start_date || terms[0].start_date}</Typography>

                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Term End Date</Typography>
                    <Typography variant="body2">{selectedTerm?.end_date || terms[0].end_date}</Typography>

                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Academic Year ID</Typography>
                    <Typography variant="body2">{selectedTerm?.academic_year.id || terms[0].academic_year.id}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Academic Year</Typography>
                    <Typography variant="body2">AY {selectedTerm?.academic_year.start_year || terms[0].academic_year.start_year}-{selectedTerm?.academic_year.end_year || terms[0].academic_year.end_year}</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>

            <Divider/>
            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteCourse}>Delete Course</Button>
                <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Course</Button>
            </CardActions>
          </Card>
        )}

        {submitStatus && (
          <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
            {submitStatus.message}
          </Alert>
        )}

      </form>
      <Typography variant="h5">Quests</Typography>
      {quests && quests.length > 0 ? (
        <QuestCard rows={quests}/>
      ) : (
        <Typography variant="body1">New quests coming soon for this course!</Typography>
      )}

    </Stack>


  );
}
