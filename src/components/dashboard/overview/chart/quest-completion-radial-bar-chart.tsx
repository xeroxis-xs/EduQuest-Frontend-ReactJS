import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import type { Quest} from "@/types/analytics/analytics-four";

interface QuestCompletionRadialBarChartProps {
  questProgress: Quest;
  enrolledStudents: number;
}

export function QuestCompletionRadialBarChart({ questProgress, enrolledStudents }: QuestCompletionRadialBarChartProps): React.JSX.Element {

  const chartOptions = useChartOptions1(
    ["Progress"],
  );

  return (
    <Chart
      options={chartOptions}
      series={[enrolledStudents === 0 ? 0 : (questProgress.quest_completion / enrolledStudents * 100)]}
      type="radialBar"
      width="100%"
      height="auto"
      align="center"
    />
  );
}


function useChartOptions1(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      type: 'radialBar',
      background: 'transparent',
      toolbar: {show: false},
      offsetY: -15,
      // width: 500,
      sparkline: {
        enabled: true
      }
    },
    labels,
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        track: {
          background: alpha(theme.palette.grey[400], 0.5),
          startAngle: -120,
          endAngle: 120,
        },
        dataLabels: {
          name: {
            show: true,
            fontWeight: 600,
            // offsetY: -2,
            // formatter() {
            //   return courseCode;
            // }
          },
          value: {
            show: true,
            fontFamily: theme.typography.fontFamily,
            fontWeight: 400,
            formatter(val: number): string {
              return `${val.toFixed(0)}%`;
            }
          },
          total: {
            show: false,
            fontFamily: theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: '14px',
            // formatter() {
            //   return courseCode;
            // }
          },
        }
      }
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
    stroke: {
      show: true,
      colors: [theme.palette.background.paper],
      width: 2,
      lineCap: "round"
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.grey[400], 0.5)],
    fill: {
      colors: [theme.palette.primary.main, alpha(theme.palette.grey[400], 0.5)],
      opacity: 0.95,
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '12px',
      },
      dropShadow: {
        enabled: false
      }
    },
    // tooltip: {
    //   enabled: true,
    //   style: {
    //     fontFamily: theme.typography.fontFamily,
    //   },
    // },
    // grid: {
    //   show: false,
    //   padding: {top: -20},
    // }
  };
}

