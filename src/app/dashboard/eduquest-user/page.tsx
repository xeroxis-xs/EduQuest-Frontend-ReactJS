"use client"
import * as React from 'react';
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import { EduquestUserTable } from '@/components/dashboard/eduquest-user/eduquest-user-table';
import type { EduquestUser } from '@/types/eduquest-user';
import { logger } from '@/lib/default-logger'
import {getAllEduquestUsers} from "@/api/services/eduquest-user";

export default function Page(): React.JSX.Element {
  const [eduquestUsers, setEduquestUsers] = React.useState<EduquestUser[]>([]);

  const fetchEduquestUsers = async (): Promise<void> => {
    try {
      const response = await getAllEduquestUsers()
      setEduquestUsers(response);
    } catch (error: unknown) {
      logger.error('Error fetching all eduquest users: ', error);
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchEduquestUsers();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} justifyContent="space-between">
          <Typography variant="h4">Eduquest Users</Typography>

          {/*<Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)"/> :*/}
          {/*  <PlusIcon fontSize="var(--icon-fontSize-md)"/>} variant="contained" onClick={toggleForm}>*/}
          {/*  {showForm ? 'Close' : 'Add'}*/}
          {/*</Button>*/}


      </Stack>
      {/*{showForm ? <EduquestUserForm onCreateSuccess={getEduquestUser} /> : null}*/}
      {/*<EduquestUserFilters/>*/}
      <EduquestUserTable rows={eduquestUsers}/>
    </Stack>
  );
}
