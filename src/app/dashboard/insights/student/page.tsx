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

export default function Page(): React.JSX.Element {
  const [eduquestUsers, setEduquestUsers] = React.useState<EduquestUser[]>([]);
  // const [showForm, setShowForm] = React.useState(false);
  //
  // const toggleForm = (): void => {
  //   setShowForm(!showForm);
  // };

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

  // const getCourseInsights = async (id: number): Promise<void> => {
  //   try {
  //     const response = await apiService.get<Course[]>(`/api/Course/${id.toString()}`);
  //     logger.debug('response', response);
  //   } catch (error: unknown) {
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 401) {
  //         await authClient.signInWithMsal();
  //       }
  //     }
  //     logger.error('Failed to load course insights', error);
  //   }
  // };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getEduquestUser();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography variant="h4">Student Insights</Typography>
        <Typography variant="body1">Student Insights</Typography>


      </Stack>
      <UserTable rows={eduquestUsers}/>
    </Stack>
  );
}
