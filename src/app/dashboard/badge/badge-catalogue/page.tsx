"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import type {Badge} from "@/types/badge";
import {BadgeCard} from "@/components/dashboard/badge/badge-card";
import { SkeletonBadgeCard } from "@/components/dashboard/skeleton/skeleton-badge-card";


export default function Page(): React.JSX.Element {
  const [badges, setBadges] = React.useState<Badge[]>([]);
  const [loadingBadge, setLoadingBadge] = React.useState(true)

  const getBadges = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Badge[]> = await apiService.get<Badge[]>('/api/Badge/');
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
    } finally {
      setLoadingBadge(false);
    }
  }


  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getBadges();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} >
          <Typography variant="h4">Badge Catalogue</Typography>

        </Stack>

      </Stack>

      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        {loadingBadge ? <SkeletonBadgeCard/> : (
          badges.length === 0 ? (
              <Typography variant="h6" align="center" mt={4}>No data available.</Typography>
            ) :
          <BadgeCard badges={badges}/>
        )}
      </Stack>
    </Stack>

  );
}
