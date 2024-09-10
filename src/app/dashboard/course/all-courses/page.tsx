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
import { CourseNewForm } from "@/components/dashboard/course/course-new-form";
import { CourseCard } from "@/components/dashboard/course/course-card";
import { SkeletonCourseCard } from "@/components/dashboard/skeleton/skeleton-course-card";
import {useUser} from "@/hooks/use-user";


export default function Page(): React.JSX.Element {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { eduquestUser } = useUser();

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getCourses = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>('/api/Course/non-private');
      const data: Course[] = response.data;
      setCourses(data);
      logger.debug('Filtered Courses', data);
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
      <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>
        <Stack spacing={1}>
          <Typography variant="h4">All Courses</Typography>
          <Typography variant="body2" color="text.secondary">List of all courses available on the platform.</Typography>
        </Stack>
        {eduquestUser?.is_staff ?
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant={showForm ? 'text' : 'contained'}
              color={showForm ? 'error' : 'primary'}
              onClick={toggleForm}
            >
              {showForm ? 'Cancel' : 'Create'}
            </Button>
          </Stack> : null}

      </Stack>
      {showForm ? <CourseNewForm onFormSubmitSuccess={getCourses} /> : null}
      {loading ? (
        <SkeletonCourseCard />
      ) : (
        courses.length === 0 ? (
          <Typography variant="h6" align="center" mt={4}>No data available.</Typography>
          ) :
        <CourseCard rows={courses} onEnrolledSuccess={getCourses} />
      )}
    </Stack>
  );
}
