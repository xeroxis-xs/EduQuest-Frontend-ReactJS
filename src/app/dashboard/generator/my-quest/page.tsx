"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MagicWand as MagicWandIcon } from '@phosphor-icons/react/dist/ssr/MagicWand';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import { logger } from '@/lib/default-logger'
import { QuestCard } from "@/components/dashboard/quest/quest-card";
import type { Quest } from '@/types/quest';
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import {GenerateQuestForm} from "@/components/dashboard/generator/generate-quest-form";
import {getMyPrivateQuests} from "@/api/services/quest";

export default function Page(): React.JSX.Element {
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);


  const toggleForm = (): void => {
    setShowForm(!showForm);
  };

  const fetchPrivateQuests = async (): Promise<void> => {
    try {
      const response = await getMyPrivateQuests()
      setQuests(response);
      // logger.debug('Private Quests', response);
    } catch (error: unknown) {
      logger.error('Error fetching private quests', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchPrivateQuests();
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
          <Typography variant="body2" color="text.secondary">You can generate quests and questions using your uploaded lecture materials!</Typography>

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
      {showForm ? <GenerateQuestForm onFormSubmitSuccess={fetchPrivateQuests} /> : null}
      {loading ? (
        <SkeletonQuestCard />
      ) : (
        quests.length === 0 ? (
          <Typography variant="body1">You have not generated any quest yet.</Typography>
        ) : (
          <QuestCard rows={quests} onQuestDeleteSuccess={fetchPrivateQuests} />
        )
      )}
    </Stack>
  );
}
