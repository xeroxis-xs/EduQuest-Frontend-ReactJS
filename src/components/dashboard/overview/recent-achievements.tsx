'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import { Typography, Tooltip, Stack } from '@mui/material';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import FirstAttemptBadge from "../../../../public/assets/first_attempt_badge.svg";
import PerfectionistBadge from "../../../../public/assets/perfectionist_badge.svg";
import ExpertBadge from "../../../../public/assets/expert_badge.svg";
import SpeedsterBadge from "../../../../public/assets/speedster_badge.svg";
import CompletionistBadge from "../../../../public/assets/completionist_badge.svg";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import { type ExtendedUserCourseBadge, type ExtendedUserQuestBadge } from "@/types/analytics/recent-badge";
import { useRouter } from 'next/navigation';


export interface RecentAchievementsProps {
  recentBadges: (ExtendedUserCourseBadge | ExtendedUserQuestBadge)[];
  sx?: SxProps;
}

export function RecentAchievements({ recentBadges = [], sx }: RecentAchievementsProps): React.JSX.Element {
  const getBadgeImage = (badgeName: string): React.JSX.Element | null => {
    switch (badgeName) {
      case 'First Attempt':
        return <FirstAttemptBadge width={30} height={30} />;
      case 'Perfectionist':
        return <PerfectionistBadge width={30} height={30} />;
      case 'Expert':
        return <ExpertBadge width={30} height={30} />;
      case 'Speedster':
        return <SpeedsterBadge width={30} height={30} />;
      case 'Completionist':
        return <CompletionistBadge width={30} height={30} />;
      default:
        return null;
    }
  };

  function isExtendedUserCourseBadge(badge: ExtendedUserCourseBadge | ExtendedUserQuestBadge): badge is ExtendedUserCourseBadge {
    return (badge as ExtendedUserCourseBadge).course_completed !== undefined;
  }

  function isExtendedUserQuestBadge(badge: ExtendedUserCourseBadge | ExtendedUserQuestBadge): badge is ExtendedUserQuestBadge {
    return (badge as ExtendedUserQuestBadge).quest_attempted !== undefined;
  }

  const router = useRouter();

  const handleRouteToQuest = (questId: string): void => {
    router.push(`/dashboard/quest/${questId}`);
  };

  const handleRouteToCourse = (courseId: string): void => {
    router.push(`/dashboard/course/${courseId}`);
  };

  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="Recent Achievements"
          avatar={
            <TrendUpIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px' }}
        />
        <Tooltip title="The most recent achievements made by users." placement="bottom">
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: "var(--mui-palette-neutral-500)", marginTop: '16px' }} />
        </Tooltip>
      </Stack>
      <Divider />
      <CardContent>
        {recentBadges.length > 0 ? (
          recentBadges.map((recentBadge) => (
            <React.Fragment key={recentBadge.id}>
              {isExtendedUserCourseBadge(recentBadge) && (
                <Grid container spacing={1} mb={1}>
                  <Grid xs={2}>
                    <Typography variant="overline" color="text.secondary" display="block">
                      {new Date(recentBadge.awarded_date).toLocaleDateString("en-SG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </Typography>
                    <Typography variant="overline" color="text.secondary">
                      {new Date(recentBadge.awarded_date).toLocaleTimeString("en-SG", {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                  <Grid xs={10}>
                    <Typography variant="body2">
                      <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle', mr: '4px' }}>
                        <UserIcon width={20} height={20} />
                      </Box>
                      {recentBadge.nickname} has just earned
                      <Tooltip title={`${recentBadge.badge.name} Badge`} placement="top">
                        <Box component="span" sx={{ display: 'inline-block', cursor: 'pointer', verticalAlign: 'middle', mx: 1 }}>
                          {getBadgeImage(recentBadge.badge.name)}
                        </Box>
                      </Tooltip>
                      from
                      <Box
                        component="span"
                        sx={{ display: 'inline', cursor: 'pointer', verticalAlign: 'middle', mx: '6px', fontWeight: '600' }}
                        onClick={() => { handleRouteToCourse(recentBadge.course_completed.course.id.toString()); }}
                      >
                      {recentBadge.course_completed.course.code} {recentBadge.course_completed.course.name}
                      </Box>
                      </Typography>
                  </Grid>
                </Grid>
              )}
              {isExtendedUserQuestBadge(recentBadge) && (
                <Grid container spacing={1} mb={1}>
                  <Grid xs={2}>
                    <Typography variant="overline" color="text.secondary" display="block">
                      {new Date(recentBadge.awarded_date).toLocaleDateString("en-SG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </Typography>
                    <Typography variant="overline" color="text.secondary">
                      {new Date(recentBadge.awarded_date).toLocaleTimeString("en-SG", {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                  <Grid xs={10}>
                    <Typography variant="body2">
                      <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle', mr: '4px' }}>
                        <UserIcon width={20} height={20} />
                      </Box>
                      {recentBadge.nickname} has just earned
                      <Tooltip title={`${recentBadge.badge.name} Badge`} placement="top">
                        <Box component="span" sx={{ display: 'inline-block', cursor: 'pointer', verticalAlign: 'middle', mx: 1 }}>
                          {getBadgeImage(recentBadge.badge.name)}
                        </Box>
                      </Tooltip>
                      from
                      <Box
                        component="span"
                        sx={{ display: 'inline', cursor: 'pointer', verticalAlign: 'middle', mx: '6px', fontWeight: '600' }}
                        onClick={() => { handleRouteToQuest(recentBadge.quest_attempted.quest.id.toString()); }}
                      >
                      {recentBadge.quest_attempted.quest.name}
                      </Box>
                      in {recentBadge.quest_attempted.quest.from_course.code} {recentBadge.quest_attempted.quest.from_course.name}

                    </Typography>
                  </Grid>
                </Grid>
              )}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="subtitle2" align="center" mt={1}>No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
}
