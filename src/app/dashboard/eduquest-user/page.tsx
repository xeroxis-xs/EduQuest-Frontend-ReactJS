"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
// import { EduquestUserFilters } from '@/components/dashboard/eduquest-user/eduquest-user-filters';
import { EduquestUserTable } from '@/components/dashboard/eduquest-user/eduquest-user-table';
import type { EduquestUser } from '@/types/eduquest-user';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import {authClient} from "@/lib/auth/client";
import { EduquestUserForm } from "@/components/dashboard/eduquest-user/eduquest-user-form";
import { Box } from '@mui/material';

export default function Page(): React.JSX.Element {
  const [eduquestUsers, setEduquestUsers] = React.useState<EduquestUser[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

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
      <Stack direction="row" spacing={1} justifyContent="space-between">
          <Typography variant="h4">Eduquest Users</Typography>

          <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)"/> :
            <PlusIcon fontSize="var(--icon-fontSize-md)"/>} variant="contained" onClick={toggleForm}>
            {showForm ? 'Close' : 'Add'}
          </Button>


      </Stack>
      {showForm ? <EduquestUserForm onCreateSuccess={getEduquestUser} /> : null}
      {/*<EduquestUserFilters/>*/}
      <EduquestUserTable rows={eduquestUsers}/>
    </Stack>
  );
}
