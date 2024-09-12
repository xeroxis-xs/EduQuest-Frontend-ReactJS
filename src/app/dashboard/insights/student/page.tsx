"use client"
import * as React from 'react';
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { EduquestUser } from '@/types/eduquest-user';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import {authClient} from "@/lib/auth/client";
// import type {Course} from "@/types/course";
import {UserTable} from "@/components/dashboard/insights/student/user-table";
import Grid from "@mui/material/Unstable_Grid2";
import {MyCourseProgress} from "@/components/dashboard/overview/my-course-progress";
import {MyQuestScores} from "@/components/dashboard/overview/my-quest-scores";
import type {Course} from "@/types/course";
import {AnalyticsPartTwo} from "@/app/dashboard/page";
import {useUser} from "@/hooks/use-user";
import {SkeletonMyCourseProgress} from "@/components/dashboard/skeleton/analytics/skeleton-my-course-progress";
import type {UserCourseProgression} from "@/types/analytics/user-course-progression";
import {SkeletonMyQuestScores} from "@/components/dashboard/skeleton/analytics/skeleton-my-quest-scores";

export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [analyticsPartTwoLoading, setAnalyticsPartTwoLoading] = React.useState(false);
  const [analyticsPartTwo, setAnalyticsPartTwo] = React.useState<AnalyticsPartTwo>({
    user_course_progression: [],
    user_badge_progression: [],
  });
  const [nullPrompt, setNullPrompt] = React.useState<string>('Select a user to view their course progress');
  const [userCourseProgression, setUserCourseProgression] = React.useState<UserCourseProgression | null>(null);
  const [eduquestUsers, setEduquestUsers] = React.useState<EduquestUser[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<EduquestUser | null>(null);
  // const [showForm, setShowForm] = React.useState(false);
  //
  // const toggleForm = (): void => {
  //   setShowForm(!showForm);
  // };

  const handleCourseSelection = (aUserCourseProgression: UserCourseProgression ) => {
    setUserCourseProgression(aUserCourseProgression);
  }


  const getEduquestUser = async (): Promise<void> => {
    try {
      const response: AxiosResponse<EduquestUser[]> = await apiService.get<EduquestUser[]>('/api/EduquestUser/');
      const data: EduquestUser[] = response.data;
      setEduquestUsers(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    }
  };

  const getAnalyticsPartTwo = async (userId: number): Promise<void> => {
    const user = eduquestUsers?.find((user) => user.id === userId) ?? null;
    setSelectedUser(user);
    try {
      setUserCourseProgression(null);
      setAnalyticsPartTwoLoading(true);
      const response: AxiosResponse<AnalyticsPartTwo> = await apiService.get<AnalyticsPartTwo>(`/api/Analytics/part-two/${userId.toString()}`);
      const data: AnalyticsPartTwo = response.data;
      logger.debug('Analytics Part Two', data);
      setAnalyticsPartTwo(data);
      if (data.user_course_progression.length === 0) {
        setNullPrompt('This user is not enrolled in any courses');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setAnalyticsPartTwoLoading(false);
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getEduquestUser();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={1} justifyContent="space-between">
        <Typography variant="h4">Student Insights</Typography>
        <Typography variant="body2" color="text.secondary">The following table shows the list of students and their course progress.</Typography>
      </Stack>

      <UserTable rows={eduquestUsers} handleUserSelection={getAnalyticsPartTwo}/>

      {selectedUser ? <Typography variant="h5" pt={2}>{`${selectedUser.username}'s Progress`}</Typography> : null}

      <Grid container spacing={3}>
        <Grid md={6} xs={12}>
          { analyticsPartTwoLoading ?
            <SkeletonMyCourseProgress
              title="Student's Courses"
              tooltip="The progress of the courses that the selected student is enrolled in"
            /> :
            (analyticsPartTwo.user_course_progression ?
                <MyCourseProgress
                  userCourseProgression={analyticsPartTwo.user_course_progression}
                  handleOnClick={handleCourseSelection}
                  title="Student's Courses"
                  tooltip="The progress of the courses that the selected student is enrolled in"
                  nullPrompt={nullPrompt}
                  sx={{ height: '100%' }} /> : null
            )
          }
        </Grid>
        <Grid md={6} xs={12}>
          { analyticsPartTwo.user_course_progression ?
            <MyQuestScores
              userCourseProgression={userCourseProgression}
              title="Student's Quest"
              prompt="Select a course to view the student's quest scores"
              tooltip="The highest score the student has achieved for each quest"
            /> : null}
        </Grid>
      </Grid>
    </Stack>
  );
}
