import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import type { UserCourseProgression, QuestScore } from "@/types/analytics/user-course-progression";

export interface CourseChartProps {
  aUserCourseProgression: UserCourseProgression;
}

export function QuestChart({ aUserCourseProgression }: CourseChartProps): React.JSX.Element {
  const questNames = aUserCourseProgression.quest_scores.map((quest: QuestScore) => quest.quest_name);
  const chartOptions = useChartOptions(questNames, aUserCourseProgression);

  const questScores: { name: string; highest_score: number; not_scored: number }[] =
    aUserCourseProgression.quest_scores.map((quest: QuestScore) => ({
      name: quest.quest_name,
      highest_score: quest.highest_score,
      not_scored: quest.max_score - quest.highest_score,
    }));

  return (
    <Chart
      options={chartOptions}
      series={[
        { name: 'Highest Score', data: questScores.map(quest => quest.highest_score) },
        { name: 'Not Scored', data: questScores.map(quest => quest.not_scored) }
      ]}
      type="bar"
      width="100%"
      height="auto"
      align="center"
    />
  );
}

function useChartOptions(labels: string[], aUserCourseProgression:UserCourseProgression): ApexOptions {
  const theme = useTheme();
  return {
    chart: {
      type: 'bar',
      background: 'transparent',
      stacked: true,
      stackType: '100%',
      toolbar: { show: false },
      // sparkline: { enabled: true }
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: 20,
        borderRadius: 10,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
        colors: {
          backgroundBarColors: [alpha(theme.palette.grey[400], 0.5)],
          backgroundBarRadius: 10,
        },
        dataLabels: { orientation: 'horizontal' },
      },
    },
    xaxis: {
      categories: labels,
      max: 100,
      labels: {
        show: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        style: {
          fontFamily: theme.typography.fontFamily,
          fontSize: '12px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { fontFamily: theme.typography.fontFamily },
    },
    fill: {
      colors: [theme.palette.primary.main, 'transparent'],
    },
    states: {
      hover: {
        filter: {
          type: 'none',
          value: 0,
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        }
      }
    },
    tooltip: {
      enabled: true,
      x: { show: false },
      style: {
        fontFamily: theme.typography.fontFamily,
      }
    },
    // title: {
    //   text: `${aUserCourseProgression.course_code} ${aUserCourseProgression.course_name}`,
    //   align: 'center',
    //   style: {
    //     fontFamily: theme.typography.fontFamily,
    //     fontSize: '16px',
    //     fontWeight: 500,
    //   },
    //   margin: 0
    // },
    grid: {
      show: false,
      padding: {  top: -20, bottom: -10 },
    },
  };
}
