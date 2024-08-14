'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Avatar from "@mui/material/Avatar";
import { Ranking as RankingIcon } from '@phosphor-icons/react/dist/ssr/Ranking';
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import {LeaderboardChart} from "@/components/dashboard/overview/chart/leaderboard-chart";
import CardContent from "@mui/material/CardContent";

export interface UserBadge {
  nickname: string;
  badges: {
    name: string;
    image: string;
  }[];
}

export interface TopCollectorsProps {
  userBadges?: UserBadge[];
  sx?: SxProps;
}

export function TopCollectors({ userBadges = [], sx }: TopCollectorsProps): React.JSX.Element {
  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
      <CardHeader
        title="Top Collectors"
        avatar={
          <Avatar sx={{ backgroundColor: 'white', height: '24px', width: '24px'}}>
            <RankingIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          </Avatar>
        }
        sx={{ pr: '10px'}}
      />
      <Tooltip title="Top 5 users with the most badges. " placement="bottom" >
        <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
      </Tooltip>
      </Stack>
      <Divider />
      <CardContent sx={{ height: '100%', p: '6px'}}>
        <LeaderboardChart userBadges={userBadges}/>
      </CardContent>


    </Card>
  );
}

