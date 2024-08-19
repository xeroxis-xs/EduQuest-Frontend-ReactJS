"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { QuestCard } from "@/components/dashboard/quest/quest-card";
import type { Quest } from '@/types/quest';
import { SkeletonQuestCard } from "@/components/dashboard/skeleton/skeleton-quest-card";
import {useUser} from "@/hooks/use-user";
import type { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {Funnel as FunnelIcon} from "@phosphor-icons/react/dist/ssr/Funnel";


export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const [courseIds, setCourseIds] = React.useState<string[]>([]);

  const getMyQuests = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Quest[]> = await apiService.get<Quest[]>(`/api/Quest/by-enrolled-user/${eduquestUser?.id.toString()}`);
        const data: Quest[] = response.data;
        setQuests(data);
        const uniqueCourseIds = Array.from(new Set(data.map(quest => `${quest.from_course.id.toString()} - ${quest.from_course.code} ${quest.from_course.name}`)));
        setCourseIds(uniqueCourseIds)
        logger.debug('My Quests', data);
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
      await getMyQuests();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  const handleCourseChange = (event: SelectChangeEvent): void => {
    setSelectedCourseId(event.target.value);
  };


  const filteredQuests = selectedCourseId
    ? quests.filter(quest => `${quest.from_course.id.toString()} - ${quest.from_course.code} ${quest.from_course.name}` === selectedCourseId)
    : quests;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>
        <Typography variant="h4">My Quests</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <FunnelIcon height={20} width={20}/>
          <FormControl size="small">
            <Select
              value={selectedCourseId || ''}
              onChange={handleCourseChange}
              displayEmpty
              sx={{minWidth: 200}}
            >
              <MenuItem value="">
                <em>All Courses</em>
              </MenuItem>
              {courseIds.map(courseId => (
                <MenuItem key={courseId} value={courseId}>
                  {courseId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      {loading ? (
          <SkeletonQuestCard/>
        ) : (
          <QuestCard rows={filteredQuests} onQuestDeleteSuccess={getMyQuests}/>
        )}
    </Stack>
  );
}
