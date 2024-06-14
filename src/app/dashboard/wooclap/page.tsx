"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { WooclapUserFilters } from '@/components/dashboard/wooclap/wooclap-user-filters';
import { WooclapUserTable } from '@/components/dashboard/wooclap/wooclap-user-table';
import type { WooclapUser } from '@/types/wooclap-user';
import apiService from "@/api/api-service";
import { type AxiosResponse } from "axios";
import { logger } from '@/lib/default-logger'
import {authClient} from "@/lib/auth/client";

function applyPagination(rows: WooclapUser[], page: number, rowsPerPage: number): WooclapUser[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [wooclapUsers, setWooclapUsers] = React.useState<WooclapUser[]>([]);
  const [paginatedWooclapUsers, setPaginatedWooclapUsers] = React.useState<WooclapUser[]>([]);

  const getWooclapUser = async (): Promise<void> => {
    try {
      const response: AxiosResponse<WooclapUser[]> = await apiService.get<WooclapUser[]>('/api/WooclapUser/');
      const data: WooclapUser[] = response.data;
      setWooclapUsers(data);
    } catch (error: unknown) {
      await authClient.signInWithMsal();
      logger.error(error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getWooclapUser();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  React.useEffect(() => {
    setPaginatedWooclapUsers(applyPagination(wooclapUsers, page, rowsPerPage));
  }, [wooclapUsers]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Wooclap Users</Typography>
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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <WooclapUserFilters />
      <WooclapUserTable
        count={paginatedWooclapUsers.length}
        page={page}
        rows={paginatedWooclapUsers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
