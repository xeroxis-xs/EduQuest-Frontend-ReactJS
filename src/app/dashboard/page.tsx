"use client";

import * as React from 'react';
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
import { type UserCourseProgression } from "@/types/analytics/user-course-progression";
import { type UserBadgeProgression } from "@/types/analytics/user-badge-progression";
import { AxiosError, type AxiosResponse } from "axios";
import apiService from "@/api/api-service";
import { logger } from "@/lib/default-logger";
import { authClient } from "@/lib/auth/client";
import { SkeletonTopCollector } from "@/components/dashboard/skeleton/analytics/skeleton-top-collector";
import { SkeletonRecentAchievements } from "@/components/dashboard/skeleton/analytics/skeleton-recent-achievements";
import {useUser} from "@/hooks/use-user";
import {SkeletonMyEnrolledCourses} from "@/components/dashboard/skeleton/analytics/skeleton-my-enrolled-courses";


export interface AnalyticsPartTwo {
  user_course_progression: UserCourseProgression[];
  user_badge_progression: UserBadgeProgression[];
}

export interface AnalyticsPartThree {
  top_users_with_most_badges: TopCollector[];
  recent_badge_awards: (ExtendedUserCourseBadge | ExtendedUserQuestBadge)[];
}

export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [analyticsPartTwoLoading, setAnalyticsPartTwoLoading] = React.useState(true);
  const [analyticsPartThreeLoading, setAnalyticsPartThreeLoading] = React.useState(true);
  const [analyticsPartTwo, setAnalyticsPartTwo] = React.useState<AnalyticsPartTwo>({
    user_course_progression: [],
    user_badge_progression: [],
  });
  const [analyticsPartThree, setAnalyticsPartThree] = React.useState<AnalyticsPartThree>({
    top_users_with_most_badges: [],
    recent_badge_awards: [],
  });

  const getAnalyticsPartTwo = async (): Promise<void> => {
    try {
      const response: AxiosResponse<AnalyticsPartTwo> = await apiService.get<AnalyticsPartTwo>(`/api/Analytics/part-two/${eduquestUser?.id.toString()}`);
      const data: AnalyticsPartTwo = response.data;
      logger.debug('Analytics Part Two', data);
      setAnalyticsPartTwo(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setAnalyticsPartTwoLoading(false);
    }
  }

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
      await getAnalyticsPartTwo();
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
        { analyticsPartTwoLoading? <SkeletonMyEnrolledCourses /> :
          (analyticsPartTwo.user_course_progression ?
              <MyEnrolledCourses userCourseProgression={analyticsPartTwo.user_course_progression} sx={{ height: '100%' }} /> : null
          )
        }

      </Grid>
      <Grid lg={4} md={12} xs={12}>
        { analyticsPartTwoLoading? <SkeletonMyEnrolledCourses /> :
          (analyticsPartTwo.user_badge_progression ?
        <MyEarnedBadges userBadgeProgression={analyticsPartTwo.user_badge_progression} sx={{ height: "100%" }}/> : null
      )}
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
