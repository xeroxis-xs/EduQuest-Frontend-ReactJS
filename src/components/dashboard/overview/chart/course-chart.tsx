import * as React from 'react';
import {alpha, useTheme} from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import {UserCourseProgression} from "@/types/analytics/user-course-progression";


export interface CourseChartProps {
  aUserCourseProgression: UserCourseProgression;
}

export function CourseChart({ aUserCourseProgression }: CourseChartProps): React.JSX.Element {

  const chartOptions = useChartOptions(aUserCourseProgression.course_name);

  return (
    <Chart
      options={chartOptions}
      series={[
        { name: 'Completed', data: [aUserCourseProgression.completed_quests] },
        { name: 'Not Completed', data: [aUserCourseProgression.total_quests - aUserCourseProgression.completed_quests] }
      ]}
      type="bar"
      width="100%"
      height={20}
    />
  );
}

function useChartOptions(label: string): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      // height: 50,
      type: 'bar',
      background: 'transparent',
      stacked: true,
      stackType: '100%',
      toolbar: {show: false},
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 10,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
        barHeight: '100%',
        colors: {
          backgroundBarColors: [alpha(theme.palette.primary.main, 0.25)],
          backgroundBarRadius: 10,
        },
        dataLabels: {
          orientation: 'horizontal'
        },
      },
    },
    xaxis: {
      categories: [label],
      max: 100,
      labels: {
        show: false,
      },
      axisBorder: {show: false},
      axisTicks: {show: false}
    },
    yaxis: {
      show: false,
      axisBorder: {show: false},
      axisTicks: {show: false}
    },
    dataLabels: {
      textAnchor: 'middle',
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontFamily: theme.typography.fontFamily,
      }
    },
    fill: {
      colors: [theme.palette.primary.main, 'transparent'],
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      show: false,
    }
  }
}
