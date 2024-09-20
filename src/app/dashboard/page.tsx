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
import { logger } from "@/lib/default-logger";
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
import {LiveIndicator} from "@/components/dashboard/overview/chart/live-indicator";
import Typography from "@mui/material/Typography";
import {MyQuestScores} from "@/components/dashboard/overview/my-quest-scores";
import {SkeletonMyQuestScores} from "@/components/dashboard/skeleton/analytics/skeleton-my-quest-scores";
import {AnalyticsPartThree} from "@/types/analytics/analytics-three";
import {AnalyticsPartTwo, UserCourseProgression} from "@/types/analytics/analytics-two";
import {AnalyticsPartOne} from "@/types/analytics/analytics-one";
import {getAnalyticsPartOne, getAnalyticsPartThree, getAnalyticsPartTwo} from "@/api/services/analytics";



export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [userCourseProgression, setUserCourseProgression] = React.useState<UserCourseProgression | null>(null);
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


  const fetchAnalyticsPartOne = async (): Promise<void> => {
    try {
      const response = await getAnalyticsPartOne()
      // logger.debug('Analytics Part One', response);
      setAnalyticsPartOne(response);
    } catch (error: unknown) {
      logger.error('Error fetching analytics part one', error);
    } finally {
      setAnalyticsPartOneLoading(false);
    }
  }

  const fetchAnalyticsPartTwo = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response = await getAnalyticsPartTwo(eduquestUser.id, 'both');
        logger.debug('Analytics Part Two', response);
        setAnalyticsPartTwo(response);
      } catch (error: unknown) {
        logger.error('Error fetching analytics part two', error);
      } finally {
        setAnalyticsPartTwoLoading(false);
      }
    }
  }

  const fetchAnalyticsPartThree = async (): Promise<void> => {
    try {
      const response = await getAnalyticsPartThree()
      // logger.debug('Analytics Part Three', response);
      setAnalyticsPartThree(response);
    } catch (error: unknown) {
      logger.error('Error fetching analytics part three', error);
    } finally {
      setAnalyticsPartThreeLoading(false);
    }
  }

  const handleOnClick = (aUserCourseProgression: UserCourseProgression ) => {
    setUserCourseProgression(aUserCourseProgression);
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchAnalyticsPartOne();
      await fetchAnalyticsPartTwo();
      await fetchAnalyticsPartThree();
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
      <Stack direction='row' spacing={3} pb={3} alignItems="center">
        <Typography variant="h4">Dashboard</Typography>
        <LiveIndicator />
      </Stack>

      <Grid container spacing={5}>
        <Grid lg={4} md={4} xs={12}>
          { eduquestUser?.is_staff ?
            analyticsPartOneLoading ? <SkeletonTotalUser /> :
              (analyticsPartOne.user_stats ?
                  <TotalUser
                    sx={{ height: '100%' }}
                    value={analyticsPartOne.user_stats.total_users}
                    trend="up"
                    diff={analyticsPartOne.user_stats.new_users_percentage} /> :
                  <TotalUser
                    sx={{ height: '100%' }}
                    value={null}
                    trend="up"
                    diff={null} />
              )
          : null }
        </Grid>
        <Grid lg={4} md={4} xs={12}>
          { eduquestUser?.is_staff ?
            analyticsPartOneLoading ? <SkeletonTotalCourse /> :
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
          : null }
        </Grid>
        <Grid lg={4} md={4} xs={12}>
          { eduquestUser?.is_staff ?
            analyticsPartOneLoading? <SkeletonTotalQuest /> :
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
           : null }
        </Grid>

        <Grid lg={5} md={6} xs={12}>
          { analyticsPartTwoLoading ?
            <SkeletonMyCourseProgress
              title="My Courses"
              tooltip="The progress of the courses that you are enrolled in"
            /> :
            (analyticsPartTwo.user_course_progression ?
              <MyCourseProgress
                userCourseProgression={analyticsPartTwo.user_course_progression}
                handleOnClick={handleOnClick}
                title="My Courses"
                tooltip="The progress of the courses that you are enrolled in"
                nullPrompt="No data available."
                sx={{ height: '100%' }} /> : null
            )
          }
        </Grid>
        <Grid lg={4} md={6} xs={12}>
          { analyticsPartTwoLoading ?
            <SkeletonMyQuestScores
              title="My Quest"
              tooltip="The highest score you have achieved for each quests"
            /> :
            (analyticsPartTwo.user_course_progression ?
                <MyQuestScores
                  userCourseProgression={userCourseProgression}
                  title="My Quest"
                  prompt="Select a course to view your quest scores"
                  tooltip="The highest score you have achieved for each quests"
                /> : null
            )
          }
        </Grid>
        <Grid lg={3} md={6} xs={12}>
          { analyticsPartTwoLoading? <SkeletonMyBadgeProgress /> :
            (analyticsPartTwo.user_badge_progression ?
                <MyBadgeProgress userBadgeProgression={analyticsPartTwo.user_badge_progression} sx={{ height: "100%" }}/> : null
            )}
        </Grid>

        <Grid container lg={5} md={6} xs={12}>
          <Grid xs={12}>
            { analyticsPartOneLoading? <SkeletonShortestUser /> :
              <ShortestUser shortestTimeUser={analyticsPartOne.shortest_time_user} />

            }
          </Grid>
          <Grid xs={12}>
            {analyticsPartThreeLoading ? <SkeletonTopCollector /> :
              (analyticsPartThree.top_users_with_most_badges ?
                  <TopCollectors topCollectors={analyticsPartThree.top_users_with_most_badges} /> : null
              )
            }
          </Grid>

        </Grid>


        <Grid lg={7} md={6} sm={12} xs={12}>
          {analyticsPartThreeLoading ? <SkeletonRecentAchievements /> :
            (analyticsPartThree.recent_badge_awards ?
                <RecentAchievements recentBadges={analyticsPartThree.recent_badge_awards} /> : null
            )
          }
        </Grid>


      </Grid>
    </Stack>
  );
}
