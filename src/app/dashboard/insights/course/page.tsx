"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import {authClient} from "@/lib/auth/client";
import {CourseTable} from "@/components/dashboard/insights/course/course-table";
import type {Course} from "@/types/course";

export default function Page(): React.JSX.Element {
  const [courses, setCourses] = React.useState<Course[]>([]);

  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>('/api/Course/non-private');
      const data: Course[] = response.data;
      setCourses(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error getting courses: ', error);
    }
  }

  const getCourseInsights = async (id: number): Promise<void> => {
    try {
      const response = await apiService.get<Course>(`/api/Course/${id.toString()}`);
      const data: Course = response.data;
      logger.debug('response', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to load course insights', error);
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourses();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
          <Typography variant="h4">Course Insights</Typography>
          <Typography variant="body1">Course Insights</Typography>
      </Stack>

      <CourseTable rows={courses} getCourseInsights={getCourseInsights}/>
    </Stack>
  );
}
