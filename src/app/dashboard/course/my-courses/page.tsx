"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Course } from '@/types/course';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { CourseCard } from "@/components/dashboard/course/course-card";
import { SkeletonCourseCard } from "@/components/dashboard/skeleton/skeleton-course-card";
import { useUser } from '@/hooks/use-user';


export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getMyCourses = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Course[]> = await apiService.get<Course[]>(`/api/Course/by-user/${eduquestUser?.id.toString()}/`);
        const data: Course[] = response.data;
        const filteredData = data.filter((course) => course.type !== 'Private');
        setCourses(filteredData);
        logger.debug('Filtered Courses', filteredData);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
        }
        logger.error('Error: ', error);
      } finally {
        setLoading(false);
      }
    }
  };


  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getMyCourses();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">My Courses</Typography>

        </Stack>

      </Stack>
      {loading ? (
        <SkeletonCourseCard />
      ) : (
        <CourseCard rows={courses} onEnrolledSuccess={getMyCourses} />
      )}
    </Stack>
  );
}
