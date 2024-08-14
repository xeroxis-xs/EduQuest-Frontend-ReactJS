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
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";

export interface UserBadge {
  name: string;
  image: string;
  nickname: string;
  awarded_on: string;
  from_course: string | null;
  from_quest: string | null;
}

export interface RecentAchievementsProps {
  userBadges?: UserBadge[];
  sx?: SxProps;
}

export function RecentAchievements({ userBadges = [], sx }: RecentAchievementsProps): React.JSX.Element {
  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="Recent Achievements"
          avatar={
            <TrendUpIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />          }
          sx={{ pr: '10px' }}
        />
        <Tooltip title="The most recent achievements made by users." placement="bottom">
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: "var(--mui-palette-neutral-500)", marginTop: '16px' }} />
        </Tooltip>
      </Stack>
      <Divider />
      <CardContent>

        {userBadges.map((badge) => (
          <Grid container spacing={1} key={badge.name}>
            <Grid>
              <Typography sx={{mb: 2}} variant="overline" color="text.secondary" >
                {badge.awarded_on} :
              </Typography>
            </Grid>
            <Grid>
              <Typography sx={{mb: 2 }} variant="body2" >
                <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle', mr: '4px' }}>
                  <UserIcon width={20} height={20} />
                </Box>
                {badge.nickname} has just earned
                <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle', mx: 1 }}>
                  <FirstAttemptBadge width={28} height={28} />
                </Box>
                from {badge.from_quest ? `Quest ${badge.from_quest}` : (badge.from_course ? `Course ${badge.from_course}` : '')}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
}
