"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { logger } from '@/lib/default-logger'
import {CourseTable} from "@/components/dashboard/insights/course/course-table";
import {getAnalyticsPartFour} from "@/api/services/analytics";
import type {AnalyticsPartFour, CourseGroup} from "@/types/analytics/analytics-four";
import {CourseGroupInfoCard} from "@/components/dashboard/insights/course/course-group-info-card";

export default function Page(): React.JSX.Element {
  const [analyticsPartFour, setAnalyticsPartFour] = React.useState<AnalyticsPartFour[]>([]);
  const [courseGroupAnalytics, setCourseGroupAnalytics] = React.useState<CourseGroup | null>(null);

  const fetchAnalyticsPartFour = async (): Promise<void> => {
    try {
      const response = await getAnalyticsPartFour();
      setAnalyticsPartFour(response);
    } catch (error: unknown) {
      logger.error('Failed to fetch analytics part four', error);
    }
  }

  const handleCourseGroupSelect = (group: CourseGroup): void => {
    setCourseGroupAnalytics(group);
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchAnalyticsPartFour();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
          <Typography variant="h4">Course Insights</Typography>
          <Typography variant="body2" color="text.secondary">The following table shows the list of courses and their progress.</Typography>

      </Stack>

      <CourseTable rows={analyticsPartFour} onCourseGroupSelect={handleCourseGroupSelect}/>

      <CourseGroupInfoCard groupProgress={courseGroupAnalytics}/>

    </Stack>
  );
}
