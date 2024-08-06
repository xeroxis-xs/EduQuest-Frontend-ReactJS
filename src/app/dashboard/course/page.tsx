"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import type { Course } from '@/types/course';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { CourseForm } from "@/components/dashboard/course/course-form";
import { CourseCard } from "@/components/dashboard/course/course-card";
import { SkeletonCourseCard } from "@/components/dashboard/skeleton/skeleton-course-card";



export default function Page(): React.JSX.Element {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);


  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>('/api/Course/');
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
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Courses</Typography>

        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
            {showForm ? 'Close' : 'Create'}
          </Button>
        </Stack>
      </Stack>
      {showForm && <CourseForm onFormSubmitSuccess={getCourses} />}
      {loading ? (
        <SkeletonCourseCard />
      ) : (
        <CourseCard rows={courses} onEnrolledSuccess={getCourses} />
      )}
    </Stack>
  );
}
