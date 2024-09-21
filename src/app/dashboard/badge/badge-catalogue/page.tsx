"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { logger } from '@/lib/default-logger'
import type {Badge} from "@/types/badge";
import {BadgeCard} from "@/components/dashboard/badge/badge-card";
import { SkeletonBadgeCard } from "@/components/dashboard/skeleton/skeleton-badge-card";
import {getBadges} from "@/api/services/badge";


export default function Page(): React.JSX.Element {
  const [badges, setBadges] = React.useState<Badge[]>([]);
  const [loadingBadge, setLoadingBadge] = React.useState(true)

  const fetchMyCourseBadges = async (): Promise<void> => {
    try {
      const response = await getBadges();
      setBadges(response);
    } catch (error: unknown) {
      logger.error('Failed to fetch badge catalogue', error);
    } finally {
      setLoadingBadge(false);
    }
  }


  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchMyCourseBadges();
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
