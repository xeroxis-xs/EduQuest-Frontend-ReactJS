import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';

export interface UserBadge {
  nickname: string;
  badges: {
    name: string;
    image: string;
  }[];
}

export interface LeaderboardChartProps {
  userBadges: UserBadge[];
}

export function LeaderboardChart({ userBadges }: LeaderboardChartProps): React.JSX.Element {
  // Sort userBadges by the number of badges in descending order
  const sortedUserBadges = [...userBadges].sort((a, b) => b.badges.length - a.badges.length);

  // Extract nicknames and badge counts
  const nicknames = sortedUserBadges.map(user => user.nickname);
  const badgeCounts = sortedUserBadges.map(user => user.badges.length);
  const badgeDetails = sortedUserBadges.map(user => {
    const badgeMap: Record<string, { count: number, image: string }> = {};
    user.badges.forEach(badge => {
      if (!badgeMap[badge.name]) {
        badgeMap[badge.name] = { count: 0, image: badge.image };
      }
      badgeMap[badge.name].count += 1;
    });
    return badgeMap;
  });

  const chartOptions = useChartOptions(nicknames, badgeCounts, badgeDetails);

  return (
    <Chart
      options={chartOptions}
      series={[{ name: 'Total Badges', data: badgeCounts }]}
      type="bar"
      width="100%"
      height="100%"
    />
  );
}

function useChartOptions(labels: string[], data: number[], badgeDetails: Record<string, { count: number, image: string }>[]): ApexOptions {
  const theme = useTheme();
  const maxValue = Math.max(...data);

  return {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
      // sparkline: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        borderRadiusApplication: 'end',
        barHeight: '100%',
        colors: {
          backgroundBarColors: ['transparent'],
          backgroundBarRadius: 0,
        },
      },
    },
    xaxis: {
      categories: labels,
      max: maxValue,
      labels: {
        show: true,
        rotate: 0,
        rotateAlways: false,
        trim: true,
        style: {
          fontFamily: theme.typography.fontFamily,
        }
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
      enabled: true,
      formatter: (val: number) => Math.round(val).toString(),
      style: {
        fontFamily: theme.typography.fontFamily,
      }
    },
    fill: {
      colors: [theme.palette.primary.main],
    },
    tooltip: {
      enabled: true,

      custom: ({ dataPointIndex }) => {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- dataPointIndex is a number */
        const details = badgeDetails[dataPointIndex];
        const detailStrings = Object.entries(details).map(([name, { count, image }]) => `
          <div style="display: flex; align-items: center;">
            <img src="${image}" alt="${name}" style="width: 26px; height: 26px; margin-right: 5px; margin-bottom: 5px; margin-top: 5px" />
            ${name}: ${count.toString()}
          </div>
        `);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- dataPointIndex is a number
        return `<div style="font-family: 'Arial', sans-serif; font-size: 12px; font-weight: 600; color: #373d3f; padding: 5px 10px; background: #f3f4f5; border-bottom: 1px solid #e3e4e5;">${labels[dataPointIndex]}</div>
          <div style="padding: 5px 10px; font-family: 'Arial', sans-serif; font-size: 12px;">
            ${detailStrings.join('')}
          </div>
        `;
      }
    },
    grid: {
      show: false,
    },
  };
}
