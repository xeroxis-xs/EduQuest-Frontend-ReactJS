"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { TotalCourse } from '@/components/dashboard/overview/total-course';
import { TotalQuest } from "@/components/dashboard/overview/total-quest";
import { ShortestUser } from "@/components/dashboard/overview/shortest-user";
import { TotalUser } from "@/components/dashboard/overview/total-user";
import { MyCourseProgress } from "@/components/dashboard/overview/my-course-progress";
import { MyBadgeProgress } from "@/components/dashboard/overview/my-badge-progress";
import { RecentAchievements } from "@/components/dashboard/overview/recent-achievements";
import { TopCollectors } from "@/components/dashboard/overview/top-collectors";
import { type ExtendedUserCourseBadge, type ExtendedUserQuestBadge } from "@/types/analytics/recent-badge";
import { type TopCollector } from "@/types/analytics/top-collector";
import { type UserCourseProgression } from "@/types/analytics/user-course-progression";
import { type UserBadgeProgression } from "@/types/analytics/user-badge-progression";
import { type UserStats } from "@/types/analytics/user-stats";
import { type CourseEnrollmentStats } from "@/types/analytics/course-enrollment-stats";
import { type QuestAttemptStats } from "@/types/analytics/quest-attempt-stats";
import { type ShortestTimeUser } from "@/types/analytics/shortest-time-user";
import { AxiosError, type AxiosResponse } from "axios";
import apiService from "@/api/api-service";
import { logger } from "@/lib/default-logger";
import { authClient } from "@/lib/auth/client";
import { SkeletonTopCollector } from "@/components/dashboard/skeleton/analytics/skeleton-top-collector";
import { SkeletonRecentAchievements } from "@/components/dashboard/skeleton/analytics/skeleton-recent-achievements";
import {useUser} from "@/hooks/use-user";
import {SkeletonMyCourseProgress} from "@/components/dashboard/skeleton/analytics/skeleton-my-course-progress";
import {SkeletonTotalUser} from "@/components/dashboard/skeleton/analytics/skeleton-total-user";
import {SkeletonTotalCourse} from "@/components/dashboard/skeleton/analytics/skeleton-total-course";
import {SkeletonTotalQuest} from "@/components/dashboard/skeleton/analytics/skeleton-total-quest";
import {SkeletonShortestUser} from "@/components/dashboard/skeleton/analytics/skeleton-shortest-user";
import {SkeletonMyBadgeProgress} from "@/components/dashboard/skeleton/analytics/skeleton-my-badge-progress";
import Stack from "@mui/material/Stack";
import {LiveIndicator} from "@/components/dashboard/overview/chart/LiveIndicator";


export interface AnalyticsPartOne {
  user_stats: UserStats;
  course_enrollment_stats: CourseEnrollmentStats;
  quest_attempt_stats: QuestAttemptStats;
  shortest_time_user: ShortestTimeUser | null;
}

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
  const [analyticsPartOneLoading, setAnalyticsPartOneLoading] = React.useState(true);
  const [analyticsPartTwoLoading, setAnalyticsPartTwoLoading] = React.useState(true);
  const [analyticsPartThreeLoading, setAnalyticsPartThreeLoading] = React.useState(true);
  const [analyticsPartOne, setAnalyticsPartOne] = React.useState<AnalyticsPartOne>({
    user_stats: {
      total_users: 0,
      new_users_percentage: 0
    },
    course_enrollment_stats: {
      total_enrollments: 0,
      new_enrollments_percentage: 0
    },
    quest_attempt_stats: {
      total_quest_attempts: 0,
      new_quest_attempts_percentage: 0
    },
    shortest_time_user: null,
  });

  const [analyticsPartTwo, setAnalyticsPartTwo] = React.useState<AnalyticsPartTwo>({
    user_course_progression: [],
    user_badge_progression: [],
  });
  const [analyticsPartThree, setAnalyticsPartThree] = React.useState<AnalyticsPartThree>({
    top_users_with_most_badges: [],
    recent_badge_awards: [],
  });

  const getAnalyticsPartOne = async (): Promise<void> => {
    try {
      const response: AxiosResponse<AnalyticsPartOne> = await apiService.get<AnalyticsPartOne>('/api/Analytics/part-one');
      const data: AnalyticsPartOne = response.data;
      logger.debug('Analytics Part One', data);
      setAnalyticsPartOne(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    } finally {
      setAnalyticsPartOneLoading(false);
    }
  }

  const getAnalyticsPartTwo = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<AnalyticsPartTwo> = await apiService.get<AnalyticsPartTwo>(`/api/Analytics/part-two/${eduquestUser.id.toString()}`);
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
      await getAnalyticsPartOne();
      await getAnalyticsPartTwo();
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
    <Stack>
      <Stack direction='row' justifyContent='flex-end'>
        <LiveIndicator />
      </Stack>

      <Grid container spacing={5}>
        <Grid lg={3} sm={6} xs={12}>
          { analyticsPartOneLoading? <SkeletonTotalUser /> :
            (analyticsPartOne.user_stats ?
                <TotalUser
                  sx={{ height: '100%' }}
                  value={analyticsPartOne.user_stats.total_users}
                  trend="up"
                  diff={analyticsPartOne.user_stats.new_users_percentage} /> :
                <TotalUser
                  sx={{ height: '100%' }}
                  value={ null }
                  trend="up"
                  diff={ null } />
            )
          }
        </Grid>
        <Grid lg={3} sm={6} xs={12}>
          { analyticsPartOneLoading? <SkeletonTotalCourse /> :
            (analyticsPartOne.course_enrollment_stats ?
              <TotalCourse
                sx={{ height: '100%' }}
                value={analyticsPartOne.course_enrollment_stats.total_enrollments}
                trend="up"
                diff={analyticsPartOne.course_enrollment_stats.new_enrollments_percentage} /> :
              <TotalCourse
                sx={{ height: '100%' }}
                value={ null }
                trend="up"
                diff={ null } />
            )
          }
        </Grid>
        <Grid lg={3} sm={6} xs={12}>
          { analyticsPartOneLoading? <SkeletonTotalQuest /> :
            (analyticsPartOne.quest_attempt_stats ?
              <TotalQuest
                sx={{ height: '100%' }}
                value={analyticsPartOne.quest_attempt_stats.total_quest_attempts}
                trend="up"
                diff={analyticsPartOne.quest_attempt_stats.new_quest_attempts_percentage} /> :
              <TotalQuest
                sx={{ height: '100%' }}
                value={ null }
                trend="up"
                diff={ null } />
            )
          }
        </Grid>
        <Grid lg={3} sm={6} xs={12}>
          { analyticsPartOneLoading? <SkeletonShortestUser /> :
              <ShortestUser shortestTimeUser={analyticsPartOne.shortest_time_user} sx={{ height: '100%' }} />

          }
        </Grid>
        <Grid lg={8} md={12} xs={12}>
          { analyticsPartTwoLoading? <SkeletonMyCourseProgress /> :
            (analyticsPartTwo.user_course_progression ?
              <MyCourseProgress userCourseProgression={analyticsPartTwo.user_course_progression} sx={{ height: '100%' }} /> : null
            )
          }

        </Grid>
        <Grid lg={4} md={12} xs={12}>
          { analyticsPartTwoLoading? <SkeletonMyBadgeProgress /> :
            (analyticsPartTwo.user_badge_progression ?
              <MyBadgeProgress userBadgeProgression={analyticsPartTwo.user_badge_progression} sx={{ height: "100%" }}/> : null
        )}
          </Grid>
        <Grid lg={6} md={12} xs={12}>
          {analyticsPartThreeLoading ? <SkeletonTopCollector /> :
            (analyticsPartThree.top_users_with_most_badges ?
                <TopCollectors topCollectors={analyticsPartThree.top_users_with_most_badges} sx={{ height: '100%' }} /> : null
            )
          }
        </Grid>
        <Grid lg={6} md={12} xs={12}>
          {analyticsPartThreeLoading ? <SkeletonRecentAchievements /> :
            (analyticsPartThree.recent_badge_awards ?
                <RecentAchievements recentBadges={analyticsPartThree.recent_badge_awards} sx={{ height: '100%' }} /> : null
            )
          }
        </Grid>
      </Grid>
    </Stack>
  );
}
