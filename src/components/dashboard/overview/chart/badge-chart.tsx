import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import type { UserBadgeProgression } from "@/types/analytics/user-badge-progression";


export interface CourseChartProps {
  aUserBadgeProgression: UserBadgeProgression;
  maxCount: number[];
}

export function BadgeChart({ aUserBadgeProgression, maxCount }: CourseChartProps): React.JSX.Element {

  const chartOptions = useChartOptions(aUserBadgeProgression.badge_name, maxCount);

  return (
    <Chart
      options={chartOptions}
      series={[{name: 'Collected', data: [aUserBadgeProgression.count] }]}
      type="bar"
      width="100%"
      height={20}
    />
  );
}

function useChartOptions(label: string, data: number[]): ApexOptions {
  const theme = useTheme();
  const maxValue = Math.max(...data);

  return {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 10,
        borderRadiusApplication: 'end',
        barHeight: '100%',
        colors: {
          backgroundBarColors: ['transparent'],
          backgroundBarRadius: 10,
        },
        // dataLabels: {
        //   position: 'top',
        //   orientation: 'horizontal'
        // },
      },
    },
    xaxis: {
      categories: [label],
      max: maxValue,
      labels: {
        show: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: false,
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    dataLabels: {
      // textAnchor: 'end',
      // offsetX: 30,
      enabled: true,
      formatter: (val: number) => Math.round(val),
      style: {
        fontFamily: theme.typography.fontFamily,
      }
    },
    fill: {
      colors: [theme.palette.primary.main],
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      show: false,
    },
  };
}

