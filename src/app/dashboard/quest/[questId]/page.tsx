"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { GameController as GameControllerIcon } from "@phosphor-icons/react/dist/ssr/GameController";
import type { Course } from '@/types/course';
import type { Question } from '@/types/question';
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
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import Link, { default as RouterLink } from "next/link";
import {paths} from "@/paths";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
import Chip from "@mui/material/Chip";

export default function Page({ params }: { params: { questId: string } }) : React.JSX.Element {
  const router = useRouter();
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const [quest, setQuest] = React.useState<Quest>();
  const [courses, setCourses] = React.useState<Course[]>();
  const [questions, setQuestions] = React.useState<Question[]>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getQuest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Quest> = await apiService.get<Quest>(`/api/Quest/${params.questId}`);
      const data: Quest = response.data;
      setQuest(data);
      logger.debug('quest', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
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
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getQuestions = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Question[]> = await apiService.get<Question[]>(`/api/Question/by-quest/${params.questId}`);
      const data: Question[] = response.data;
      setQuestions(data);
      logger.debug('question', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
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
        name: course.name,
        code: course.code,
        description: course.description,
        status: course.status,
        term: course.term
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      from_course: selectedCourse || quest?.from_course
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, updatedQuest);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      await getQuest();
      setShowForm(false)
    } catch (error) {
      logger.error('Submit Error:', error);
      setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });

    }

  };

  const handleDeleteQuest = async () => {
    try {
      await apiService.delete(`/api/Quest/${params.questId}`);
      router.push(paths.dashboard.quest);
    } catch (error) {
      logger.error('Failed to delete the quest', error);
      setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getQuest();
      await getCourses();
      await getQuestions();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      {quest &&
      <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          <Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} component={RouterLink} href={`/dashboard/course/${quest?.from_course.id.toString()}`}>Back to Quests for {quest.from_course.code} {quest.from_course.name}</Button>
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Quest'}
        </Button>
      </Stack>
      }

      {!showForm && quest ?
        <Card>
          <CardHeader title="Quest Details"/>
          <Divider/>
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest ID</Typography>
                <Typography variant="body2">{quest.id}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Type</Typography>
                <Typography variant="body2">{quest.type}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Name</Typography>
                <Typography variant="body2">{quest.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Number of Questions</Typography>
                <Typography variant="body2">{questions?.length}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2">Quest Description</Typography>
                <Typography variant="body2">{quest.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Created By</Typography>
                <Typography variant="body2">{quest.organiser.username}</Typography>
                <Typography variant="body2">{quest.organiser.email}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Quest Status</Typography>
                <Chip label={quest.status} sx={{ mt: 1 }} color="success"/>
              </Grid>

            </Grid>
            <Divider sx={{my: 3}}/>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course ID</Typography>
                <Typography variant="body2">
                  <Link href={`/dashboard/course/${quest.from_course.id.toString()}`}>{quest.from_course.id}</Link>
                </Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Code</Typography>
                <Typography variant="body2">{quest.from_course.code}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Name</Typography>
                <Typography variant="body2">{quest.from_course.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Description</Typography>
                <Typography variant="body2">{quest.from_course.description}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Year / Term</Typography>
                <Typography variant="body2">AY {quest.from_course.term.academic_year.start_year}-{quest.from_course.term.academic_year.end_year} / {quest.from_course.term.name}</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <Typography variant="subtitle2">Course Duration</Typography>
                <Typography variant="body2">From {quest.from_course.term.start_date} to {quest.from_course.term.end_date}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button endIcon={<GameControllerIcon fontSize="var(--icon-fontSize-md)"/>}
                    component={RouterLink}
                    variant={'contained'}
                    href={`/dashboard/quest/${params.questId}/question`}>
              Start Quest</Button>
          </CardActions>
        </Card> : null}

      <form onSubmit={handleSubmit}>
        {showForm && quest ? <Card>
            <CardHeader title={`Quest ${quest.id.toString()}`}/>
            <Divider/>

            <CardContent>

              <Grid container spacing={3}>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Type</InputLabel>
                    <OutlinedInput defaultValue={quest.type} label="Quest Type" inputRef={questTypeRef} name="code"/>
                  </FormControl>
                </Grid>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Name</InputLabel>
                    <OutlinedInput defaultValue={quest.name} label="Quest Name" inputRef={questNameRef} name="name"/>
                  </FormControl>
                </Grid>
                <Grid md={4} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Status</InputLabel>
                    <OutlinedInput defaultValue={quest.status} label="Quest Status" inputRef={questStatusRef}
                                   name="status"/>
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Quest Description</InputLabel>
                    <OutlinedInput defaultValue={quest.description} label="Quest Description"
                                   inputRef={questDescriptionRef} name="description"/>
                  </FormControl>
                </Grid>

              </Grid>

              <Divider sx={{my: 4}}/>

              <Typography sx={{my: 3}} variant="h6">Course</Typography>
              {courses ?
                <Grid container spacing={3} >
                  <Grid md={3} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course ID</InputLabel>
                      <Select defaultValue={quest.from_course.id} onChange={handleCourseChange} inputRef={questCourseIdRef}
                              label="Course ID" variant="outlined" type="number">
                        {courses.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    </Grid>
                    <Grid md={9} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Name</Typography>
                    <Typography variant="body2">{selectedCourse?.name || courses[0].name}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Code</Typography>
                    <Typography variant="body2">{selectedCourse?.code || courses[0].code}</Typography>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Typography variant="subtitle2">Course Description</Typography>
                    <Typography variant="body2">{selectedCourse?.description || courses[0].description}</Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Year / Term</Typography>
                    <Typography variant="body2">
                      AY {selectedCourse?.term.academic_year.start_year || courses[0].term.academic_year.start_year}-{selectedCourse?.term.academic_year.end_year || courses[0].term.academic_year.end_year} / {selectedCourse?.term.name || courses[0].term.name}
                    </Typography>
                  </Grid>
                  <Grid md={3} xs={6}>
                    <Typography variant="subtitle2">Course Duration</Typography>
                    <Typography variant="body2">
                      From {selectedCourse?.term.start_date || courses[0].term.start_date} to {selectedCourse?.term.end_date || courses[0].term.end_date}
                    </Typography>
                  </Grid>

                </Grid> : null}
            </CardContent>

            <Divider/>
            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteQuest}>Delete Quest</Button>
                <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Quest</Button>
            </CardActions>
          </Card> : null}

        {submitStatus ? <Alert severity={submitStatus.type} sx={{marginTop: 2}}>
            {submitStatus.message}
          </Alert> : null}

      </form>


    </Stack>


  );
}
