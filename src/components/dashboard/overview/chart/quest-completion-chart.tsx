import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import type { CourseGroup} from "@/types/analytics/analytics-four";
import {logger} from "@/lib/default-logger";

export interface QuestCompletionChartProps {
  groupProgress: CourseGroup;
}

export function QuestScoreChart({ groupProgress }: QuestCompletionChartProps): React.JSX.Element {
  const groupNames = groupProgress.quests.map((quest) => quest.quest_name);
  const chartOptions = useChartOptions(groupNames);

  const questCompletion: { name: string; completed: number; not_completed: number }[] =
    groupProgress.quests.map((quest) => ({
      key: quest.quest_id, // Ensure unique keys
      name: quest.quest_name,
      completed: quest.quest_completion,
      not_completed: groupProgress.enrolled_students - quest.quest_completion,
    }));

  logger.debug('Quest Scores:', questCompletion);

  return (
    <Chart
      options={chartOptions}
      series={[
        { name: 'Completed', data: questCompletion.map(quest => quest.completed) },
        { name: 'Not Completed', data: questCompletion.map(quest => quest.not_completed) }
      ]}
      type="bar"
      width="100%"
      height={groupProgress.quests.length * 60}
      align="center"
    />
  );
}

function useChartOptions(labels: string[]): ApexOptions {
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
    grid: {
      show: false,
      padding: {  top: -20, bottom: -10 },
    },
  };
}
