"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

import { CourseFilters } from '@/components/dashboard/course/course-filters';
import { CourseTable } from '@/components/dashboard/course/course-table';
import type { Course } from '@/types/course';
import apiService from "@/api/api-service";
import { type AxiosResponse } from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { CourseForm } from "@/components/dashboard/course/course-form";

export default function Page(): React.JSX.Element {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getCourse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Course[]> = await apiService.get<Course[]>('/api/Course/');
      const data: Course[] = response.data;
      setCourses(data);
      logger.debug('data', data);
    } catch (error: unknown) {
      logger.error('Failed to fetch data', error);
      await authClient.signInWithMsal();
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getCourse();
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
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
            {showForm ? 'Close' : 'Add'}
          </Button>
        </div>
      </Stack>
      {showForm && <CourseForm />} {/* Conditional rendering */}
      <CourseFilters />
      <CourseTable rows={courses}
      />
    </Stack>
  );
}
