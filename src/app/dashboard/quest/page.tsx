"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { QuestForm } from "@/components/dashboard/quest/quest-form";
import { QuestCard } from "@/components/dashboard/quest/quest-card";
import type { Quest } from '@/types/quest';

export default function Page(): React.JSX.Element {
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getQuests = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Quest[]> = await apiService.get<Quest[]>('/api/Quest/');
      const data: Quest[] = response.data;
      setQuests(data);
      logger.debug('data', data);
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
      await getQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quests</Typography>

        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"  />} variant="contained">
            Import
          </Button>
          <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>
            {showForm ? 'Close' : 'Create'}
          </Button>
        </Stack>
      </Stack>
      {showForm && <QuestForm onFormSubmitSuccess={getQuests}/>} {/* Conditional rendering */}
      {quests &&<QuestCard rows={quests}/>}
    </Stack>
  );
}
