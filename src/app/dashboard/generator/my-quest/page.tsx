"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MagicWand as MagicWandIcon } from '@phosphor-icons/react/dist/ssr/MagicWand';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { QuestCard } from "@/components/dashboard/quest/quest-card";
import type { Quest } from '@/types/quest';
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import {GenerateQuestForm} from "@/components/dashboard/generator/generate-quest-form";
import {useUser} from "@/hooks/use-user";
import {Plus as PlusIcon} from "@phosphor-icons/react/dist/ssr/Plus";

export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);


  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const getPrivateQuests = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Quest[]> = await apiService.get<Quest[]>(`/api/Quest/private/by-user/${eduquestUser.id.toString()}/`);
        const data: Quest[] = response.data;
        setQuests(data);
        logger.debug('Private Quests', data);
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
      await getPrivateQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Generated Quests</Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Button
            startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <MagicWandIcon fontSize="var(--icon-fontSize-md)" />}
            variant={showForm ? 'text' : 'contained'}
            color={showForm ? 'error' : 'primary'}
            onClick={toggleForm}
          >
            {showForm ? 'Cancel' : 'Generate Quest'}
          </Button>

        </Stack>
      </Stack>
      {showForm ? <GenerateQuestForm onFormSubmitSuccess={getPrivateQuests} /> : null}
      {loading ? (
        <SkeletonQuestCard />
      ) : (
        quests.length === 0 ? (
          <Typography variant="body1">You have not generated any Quests yet.</Typography>
        ) : (
          <QuestCard rows={quests} onQuestDeleteSuccess={getPrivateQuests} />
        )
      )}
    </Stack>
  );
}
