"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
// import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
// import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
// import { GameController as GameControllerIcon } from "@phosphor-icons/react/dist/ssr/GameController";
// import type { Course } from '@/types/course';
// import type { Question } from '@/types/question';
// import type { Quest } from '@/types/quest';
import apiService from "@/api/api-service";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import Divider from "@mui/material/Divider";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Unstable_Grid2";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import Select, { type SelectChangeEvent } from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import CardActions from "@mui/material/CardActions";
// import Link, { default as RouterLink } from "next/link";
// import {paths} from "@/paths";
// import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
// import {useRouter} from "next/navigation";
import {XCircle as XCircleIcon} from "@phosphor-icons/react/dist/ssr/XCircle";
// import Chip from "@mui/material/Chip";
// import {QuestionCard} from "@/components/dashboard/quest/question/question-card";
// import {Answer} from "@/types/answer";
import type { UserQuestQuestionAttempt} from "@/types/user-quest-question-attempt";
import { QuestionAttemptCard } from "@/components/dashboard/quest/question/attempt/question-attempt-card";


export default function Page({ params }: { params: { userQuestAttemptId: string } }) : React.JSX.Element {
  // const router = useRouter();
  // const questTypeRef = React.useRef<HTMLInputElement>(null);
  // const questNameRef = React.useRef<HTMLInputElement>(null);
  // const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  // const questStatusRef = React.useRef<HTMLInputElement>(null);
  // const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  // const [quest, setQuest] = React.useState<Quest>();
  // const [answers, setAnswers] = React.useState<Answer[]>();
  const [attemptedQuestionsAndAnswers, setAttemptedQuestionsAndAnswers] = React.useState<UserQuestQuestionAttempt[]>();
  // const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  // const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  // const getQuest = async (): Promise<void> => {
  //   try {
  //     const response: AxiosResponse<Quest> = await apiService.get<Quest>(`/api/Quest/${params.questId}`);
  //     const data: Quest = response.data;
  //     setQuest(data);
  //     logger.debug('quest', data);
  //   } catch (error: unknown) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 401) {
  //         await authClient.signInWithMsal();
  //       }
  //     }
  //     logger.error('Failed to fetch data', error);
  //   }
  // };

  // const getQuestions = async (): Promise<void> => {
  //   try {
  //     const response: AxiosResponse<Question[]> = await apiService.get<Question[]>(`/api/Course/`);
  //     const data: Question[] = response.data;
  //     setCourses(data);
  //     logger.debug('courses', data);
  //   } catch (error: unknown) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 401) {
  //         await authClient.signInWithMsal();
  //       }
  //     }
  //     logger.error('Failed to fetch data', error);
  //   }
  // };

  const getAttemptedQuestionsAndAnswers = async (): Promise<void> => {
    try {
      const response: AxiosResponse<UserQuestQuestionAttempt[]> = await apiService.get<UserQuestQuestionAttempt[]>(`/api/UserQuestQuestionAttempt/by-user-quest-attempt/${params.userQuestAttemptId}`);
      const data: UserQuestQuestionAttempt[] = response.data;
      setAttemptedQuestionsAndAnswers(data);
      logger.debug('UserQuestQuestionAttempt', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  // const getAnswers = async (): Promise<void> => {
  //   try {
  //     const response: AxiosResponse<Answer[]> = await apiService.get<Answer[]>(`/api/Answer/by-quest/${params.questId}`);
  //     const data: Answer[] = response.data;
  //     setAnswers(data);
  //     logger.debug('answer', data);
  //   } catch (error: unknown) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 401) {
  //         await authClient.signInWithMsal();
  //       }
  //     }
  //     logger.error('Failed to fetch data', error);
  //   }
  // };

  // const handleCourseChange = (event: SelectChangeEvent<number>) => {
  //   // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
  //   const courseId = Number(event.target.value); // Convert the value to a number
  //   const course = courses?.find(c => c.id === courseId);
  //   if (course) {
  //     setSelectedCourse({
  //       id: course.id,
  //       name: course.name,
  //       code: course.code,
  //       description: course.description,
  //       status: course.status,
  //       term: course.term
  //     });
  //   }
  // };
  //
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const updatedQuest = {
  //     type: questTypeRef.current?.value,
  //     name: questNameRef.current?.value,
  //     description: questDescriptionRef.current?.value,
  //     status: questStatusRef.current?.value,
  //     from_course: selectedCourse || quest?.from_course
  //   };
  //
  //   try {
  //     const response: AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${params.questId}/`, updatedQuest);
  //     logger.debug('Update Success:', response.data);
  //     setSubmitStatus({ type: 'success', message: 'Update Successful' });
  //     await getQuest();
  //     setShowForm(false)
  //   } catch (error) {
  //     logger.error('Submit Error:', error);
  //     setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });
  //
  //   }
  //
  // };

  // const handleDeleteQuest = async () => {
  //   try {
  //     await apiService.delete(`/api/Quest/${params.questId}`);
  //     router.push(paths.dashboard.quest);
  //   } catch (error) {
  //     logger.error('Failed to delete the quest', error);
  //     setSubmitStatus({ type: 'error', message: 'Delete Failed. Please try again.' });
  //   }
  // };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getAttemptedQuestionsAndAnswers();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      {attemptedQuestionsAndAnswers && attemptedQuestionsAndAnswers.length > 0 &&
        <Stack direction="row" spacing={3} sx={{justifyContent: 'space-between'}}>
          {/*<Button startIcon={<CaretLeftIcon fontSize="var(--icon-fontSize-md)"/>} href={`/dashboard/quest/${attemptedQuestionsAndAnswers?[0]}`}>Return to Quest</Button>*/}
        <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PenIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
          {showForm ? 'Close' : 'Edit Question'}
        </Button>
      </Stack>
      }

      <QuestionAttemptCard data={attemptedQuestionsAndAnswers}/>
    </Stack>


  );
}
