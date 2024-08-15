"use client";

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { TotalCourse } from '@/components/dashboard/overview/total-course';
import { TotalQuest } from "@/components/dashboard/overview/total-quest";
import { Goat } from "@/components/dashboard/overview/goat";
import { TotalUser } from "@/components/dashboard/overview/total-user";
import { MyEnrolledCourses } from "@/components/dashboard/overview/my-enrolled-courses";
import { MyEarnedBadges } from "@/components/dashboard/overview/my-earned-badges";
import { RecentAchievements } from "@/components/dashboard/overview/recent-achievements";
import { TopCollectors } from "@/components/dashboard/overview/top-collectors";
import { type ExtendedUserCourseBadge, type ExtendedUserQuestBadge } from "@/types/analytics/recent-badge";
import { type TopCollector } from "@/types/analytics/top-collector";
import { AxiosError, type AxiosResponse } from "axios";
import apiService from "@/api/api-service";
import { logger } from "@/lib/default-logger";
import { authClient } from "@/lib/auth/client";
import { SkeletonTopCollector } from "@/components/dashboard/skeleton/analytics/skeleton-top-collector";
import { SkeletonRecentAchievements } from "@/components/dashboard/skeleton/analytics/skeleton-recent-achievements";


export interface AnalyticsPartThree {
  top_users_with_most_badges: TopCollector[];
  recent_badge_awards: (ExtendedUserCourseBadge | ExtendedUserQuestBadge)[];
}

export default function Page(): React.JSX.Element {
  const [analyticsPartThreeLoading, setAnalyticsPartThreeLoading] = React.useState(true);
  const [analyticsPartThree, setAnalyticsPartThree] = React.useState<AnalyticsPartThree>({
    top_users_with_most_badges: [],
    recent_badge_awards: [],
  });

  const getAnalyticsPartThree = async (): Promise<void> => {
    try {
      const response: AxiosResponse<AnalyticsPartThree> = await apiService.get<AnalyticsPartThree>('/api/Analytics/part-three/');
      const data: AnalyticsPartThree = response.data;
      logger.debug('Analytics Part Three', data);
      setAnalyticsPartThree(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setAnalyticsPartThreeLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getAnalyticsPartThree();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });

    const intervalId = setInterval(fetchData, 60000); // Fetch data every 60 seconds

    return () => { clearInterval(intervalId); }; // Clear interval on component unmount
  }, []);

  // React.useEffect(() => {
  //   logger.debug('Analytics Part Three', analyticsPartThree);
  // }, [analyticsPartThree]);

  return (
    <Grid container spacing={5}>
      <Grid lg={3} sm={6} xs={12}>
        <TotalUser sx={{ height: '100%' }} value="10" trend="up" diff={12} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCourse sx={{ height: '100%' }} value="12" trend="up" diff={16} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalQuest sx={{ height: '100%' }} value="56" trend="up" diff={1} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <Goat sx={{ height: '100%' }} value={{ nickname: 'TEOH XI SHENG', quest: 'Quest 1 from CSC1', time: '50ms' }} />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <MyEnrolledCourses
          courses={[
            {
              id: '123',
              code: 'CS2001',
              name: 'Artificial Intelligence',
              term: 'AY 2023 Semester 1',
              quests: 4,
              completed: 1,
            },
            {
              id: '124',
              code: 'CS2002',
              name: 'Data Science',
              term: 'AY 2023 Semester 1',
              quests: 5,
              completed: 1,
            },
            {
              id: '125',
              code: 'CS2003',
              name: 'Machine Learning',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
            {
              id: '126',
              code: 'CS2004',
              name: 'Cyber Security',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
            {
              id: '127',
              code: 'CS2005',
              name: 'Software Engineering',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 2,
            },
            {
              id: '128',
              code: 'CS2006',
              name: 'Computer Networks',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={12} xs={12}>
        <MyEarnedBadges
          badges={[
            { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg', count: 3 },
            { name: 'Completionist Badge', image: '/assets/completionist_badge.svg', count: 1 },
            { name: 'Expert Badge', image: '/assets/expert_badge.svg', count: 0 },
            { name: 'Speedster Badge', image: '/assets/speedster_badge.svg', count: 2 },
            { name: 'Perfectionist Badge', image: '/assets/perfectionist_badge.svg', count: 1 },
          ]}
        />
      </Grid>
      <Grid lg={5} md={12} xs={12}>
        {analyticsPartThreeLoading ? <SkeletonTopCollector /> :
          (analyticsPartThree.top_users_with_most_badges ?
              <TopCollectors topCollectors={analyticsPartThree.top_users_with_most_badges} sx={{ height: '100%' }} /> : null
          )
        }
      </Grid>
      <Grid lg={7} md={12} xs={12}>
        {analyticsPartThreeLoading ? <SkeletonRecentAchievements /> :
          (analyticsPartThree.recent_badge_awards ?
              <RecentAchievements recentBadges={analyticsPartThree.recent_badge_awards} sx={{ height: '100%' }} /> : null
          )
        }
      </Grid>
    </Grid>
  );
}
