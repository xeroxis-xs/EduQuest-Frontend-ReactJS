"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

import { EduquestUserFilters } from '@/components/dashboard/eduquest-user/eduquest-user-filters';
import { EduquestUserTable } from '@/components/dashboard/eduquest-user/eduquest-user-table';
import type { EduquestUser } from '@/types/eduquest-user';
import apiService from "@/api/api-service";
import { type AxiosResponse } from "axios";
import { logger } from '@/lib/default-logger'
import {authClient} from "@/lib/auth/client";
import { EduquestUserForm } from "@/components/dashboard/eduquest-user/eduquest-user-form";

function applyPagination(rows: EduquestUser[], page: number, rowsPerPage: number): EduquestUser[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [eduquestUsers, setEduquestUsers] = React.useState<EduquestUser[]>([]);
  const [paginatedEduquestUsers, setPaginatedEduquestUsers] = React.useState<EduquestUser[]>([]);
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
      await authClient.signInWithMsal();
      logger.error(error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getEduquestUser();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  React.useEffect(() => {
    setPaginatedEduquestUsers(applyPagination(eduquestUsers, page, rowsPerPage));
  }, [eduquestUsers]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Eduquest Users</Typography>
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
      {showForm && <EduquestUserForm />} {/* Conditional rendering */}
      <EduquestUserFilters />
      <EduquestUserTable
        count={paginatedEduquestUsers.length}
        page={page}
        rows={paginatedEduquestUsers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
