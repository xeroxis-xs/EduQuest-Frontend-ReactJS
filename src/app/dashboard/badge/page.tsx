"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

// import { CourseFilters } from '@/components/dashboard/course/course-filters';
// import { CourseTable } from '@/components/dashboard/course/course-table';
import type { Course } from '@/types/course';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import { CourseForm } from "@/components/dashboard/course/course-form";
import { CourseCard } from "@/components/dashboard/course/course-card";
import {Badge} from "@/types/badge";
import {BadgeCard} from "@/components/dashboard/badge/badge-card";
import {UserCourseBadge} from "@/types/user-course-badge";
import {useUser} from "@/hooks/use-user";
import {useEffect} from "react";
import {UserQuestBadge} from "@/types/user-quest-badge";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import {CourseBadgeCard} from "@/components/dashboard/badge/course-badge-card";
import {QuestBadgeCard} from "@/components/dashboard/badge/quest-badge-card";
import RouterLink from 'next/link';
import { paths } from "@/paths";
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';


export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [badges, setBadges] = React.useState<Badge[]>([]);
  const [courseBadges, setCourseBadges] = React.useState<UserCourseBadge[]>([]);
  const [questBadges, setQuestBadges] = React.useState<UserQuestBadge[]>([]);
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getBadges = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await apiService.get<Badge[]>('/api/Badge/');
      const data: Badge[] = response.data;
      setBadges(data);
      logger.debug('Badges', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  }

  const getMyCourseBadges = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await apiService.get<UserCourseBadge[]>(`/api/UserCourseBadge/by-user/${eduquestUser?.id.toString()}/`);
      const data: UserCourseBadge[] = response.data;
      setCourseBadges(data);
      logger.debug('Course Badges', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  }

  const getMyQuestBadges = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await apiService.get<UserQuestBadge[]>(`/api/UserQuestBadge/by-user/${eduquestUser?.id.toString()}/`);
      const data: UserQuestBadge[] = response.data;
      setQuestBadges(data);
      logger.debug('Quest Badges', data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch data', error);
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getBadges();
      await getMyCourseBadges();
      await getMyQuestBadges();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Badge Catalogue</Typography>

        </Stack>
        {/*<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>*/}
        {/*  <Button startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"  />} variant="contained">*/}
        {/*    Import*/}
        {/*  </Button>*/}
        {/*  <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>*/}
        {/*    {showForm ? 'Close' : 'Create'}*/}
        {/*  </Button>*/}
        {/*</Stack>*/}
      </Stack>
      <BadgeCard badges={badges}/>

      <Stack spacing={1} sx={{ flex: '1 1 auto', mt:5 }}>
        <Typography variant="h4">My Badges</Typography>

        <TabContext value={value}>
          <Box >
            <TabList onChange={handleChange} aria-label="lab API tabs example" >
              <Tab label="From Courses" value="1" sx={{px:2}}/>
              <Tab label="From Quests" value="2" sx={{px:2}}/>
            </TabList>
          </Box>
          <TabPanel value="1">
            { courseBadges.length > 0 ?
            <CourseBadgeCard courseBadges={courseBadges}/>
            :
              <Box>
                <Typography variant="body2">No badges earned from any courses yet.</Typography>
                <Button
                  endIcon={<CaretRightIcon/>}
                  component={RouterLink}
                  href={paths.dashboard.course}
                  sx={{mt:2}}
                  variant="outlined">Browse Courses</Button>
              </Box>
            }
          </TabPanel>
          <TabPanel value="2">
            { questBadges.length > 0 ?
              <QuestBadgeCard questBadges={questBadges}/>
              :
              <Box>
                <Typography variant="body2">No badges earned from any quests yet.</Typography>
                <Button
                  endIcon={<CaretRightIcon/>}
                  component={RouterLink}
                  href={paths.dashboard.quest}
                  sx={{mt:2}}
                  variant="outlined">Browse Quests</Button>
              </Box>
            }
          </TabPanel>
        </TabContext>

      </Stack>
    </Stack>
  );
}
