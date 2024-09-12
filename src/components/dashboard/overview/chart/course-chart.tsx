import * as React from 'react';
import {alpha, useTheme} from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import type { UserCourseProgression } from "@/types/analytics/user-course-progression";


export interface CourseChartProps {
  aUserCourseProgression: UserCourseProgression;
}

export function CourseChart({ aUserCourseProgression }: CourseChartProps): React.JSX.Element {

  const chartOptions = useChartOptions1(
    ["Progress"],
    aUserCourseProgression.course_code,
  );

  return (
    <Chart
      options={chartOptions}
      series={[aUserCourseProgression.total_quests === 0 ? 0 : (aUserCourseProgression.completed_quests / aUserCourseProgression.total_quests * 100)]}      type="radialBar"
      width="100%"
      height="auto"
      align="center"
      // parentHeightOffset={-50}
    />
  );
}

// function useChartOptions(label: string): ApexOptions {
//   const theme = useTheme();
//
//   return {
//     chart: {
//       // height: 50,
//       type: 'bar',
//       background: 'transparent',
//       stacked: true,
//       stackType: '100%',
//       toolbar: {show: false},
//       // sparkline: {
//       //   enabled: true
//       // }
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         borderRadius: 10,
//         borderRadiusApplication: 'around',
//         borderRadiusWhenStacked: 'all',
//         barHeight: 20,
//         colors: {
//           backgroundBarColors: [alpha(theme.palette.primary.main, 0.25)],
//           backgroundBarRadius: 10,
//         },
//         dataLabels: {
//           orientation: 'horizontal'
//         },
//       },
//     },
//
//     legend: {
//       show: false
//     },
//     xaxis: {
//       categories: [label],
//       max: 100,
//       labels: {
//         show: false,
//       },
//       axisBorder: {show: false},
//       axisTicks: {show: false}
//     },
//     yaxis: {
//       show: true,
//       labels: {
//         show: true,
//         style: {
//           fontFamily: theme.typography.fontFamily,
//           fontSize: '12px',
//         },
//       },
//       axisBorder: {show: false},
//       axisTicks: {show: false}
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number) => `${val.toFixed(0)}%`,
//       style: {
//         fontFamily: theme.typography.fontFamily,
//       }
//     },
//     fill: {
//       colors: [theme.palette.primary.main, 'transparent'],
//     },
//     tooltip: {
//       enabled: true,
//       style: {
//         fontFamily: theme.typography.fontFamily,
//       },
//       x: {
//         show: true
//       },
//     },
//     grid: {
//       show: false,
//     }
//   }
// }

// function useChartOptions(labels: string[], courseCode: string): ApexOptions {
//   const theme = useTheme();
//
//   return {
//     chart: {
//       type: 'donut',
//       background: 'transparent',
//       toolbar: {show: false},
//       offsetY: 35,
//       // width: 500,
//       sparkline: {
//         enabled: true
//       }
//     },
//     labels,
//     plotOptions: {
//       pie: {
//         startAngle: -120,
//         endAngle: 120,
//         offsetY: 10,
//         customScale: 1,
//         expandOnClick: false,
//         dataLabels: {
//           offset: -3,
//         },
//         donut: {
//           size: '65%',
//           labels: {
//             show: true,
//             name: {
//               show: true,
//               offsetY: -2,
//               formatter() {
//                 return courseCode;
//               }
//             },
//             value: {
//               show: false
//             },
//             total: {
//               show: true,
//               showAlways: true,
//               fontFamily: theme.typography.fontFamily,
//               fontWeight: 600,
//               fontSize: '14px',
//               formatter() {
//                 return '';
//               }
//             },
//           }
//         }
//       }
//     },
//     states: {
//       hover: {
//         filter: {
//           type: 'none',
//           value: 0,
//         }
//       },
//       active: {
//         allowMultipleDataPointsSelection: false,
//         filter: {
//           type: 'none',
//           value: 0,
//         }
//       }
//     },
//     stroke: {
//       show: true,
//       colors: [theme.palette.background.paper],
//       width: 2,
//     },
//     colors: [theme.palette.primary.main, alpha(theme.palette.grey[400], 0.5)],
//     fill: {
//       colors: [theme.palette.primary.main, alpha(theme.palette.grey[400], 0.5)],
//       opacity: 0.95,
//     },
//     legend: {
//       show: false
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number) => `${val.toFixed(0)}%`,
//       style: {
//         fontFamily: theme.typography.fontFamily,
//         fontSize: '12px',
//       },
//       dropShadow: {
//         enabled: false
//       }
//     },
//     tooltip: {
//       enabled: true,
//       style: {
//         fontFamily: theme.typography.fontFamily,
//       },
//     },
//     grid: {
//       // show: false,
//       padding: {top: -50, bottom: -50},
//     }
//   };
// }

function useChartOptions1(labels: string[], courseCode: string): ApexOptions {
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

var options2 = {
  chart: {
    height: 280,
    type: "radialBar",
  },
  series: [67],
  colors: ["#20E647"],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#333',
        startAngle: -90,
        endAngle: 90,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "30px",
          show: true
        }
      }
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      gradientToColors: ["#87D4F9"],
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: "round"
  },
  labels: ["Progress"]
};
