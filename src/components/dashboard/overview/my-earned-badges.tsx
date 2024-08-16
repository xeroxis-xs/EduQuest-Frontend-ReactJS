'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Avatar from "@mui/material/Avatar";
import { Medal as MedalIcon } from '@phosphor-icons/react/dist/ssr/Medal';
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import {BadgeChart} from "@/components/dashboard/overview/chart/badge-chart";
import {UserBadgeProgression} from "@/types/analytics/user-badge-progression";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";



export interface MyEarnedBadgesProps {
  userBadgeProgression?: UserBadgeProgression[];
  sx?: SxProps;
}

export function MyEarnedBadges({ userBadgeProgression = [], sx }: MyEarnedBadgesProps): React.JSX.Element {
  const badgeCounts = userBadgeProgression.map(i => i.count);

  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
      <CardHeader
        title="My Badges"
        avatar={
          <MedalIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
        }
        sx={{ pr: '10px'}}
      />
      <Tooltip title="The badges that you have earned so far." placement="bottom" >
        <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
      </Tooltip>
      </Stack>
      <Divider />
      <CardContent sx={{ height: "100%"}}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          height="100%"
        >
        {userBadgeProgression.map((aUserBadgeProgression) => (
          <Grid container spacing={2} key={aUserBadgeProgression.badge_id} width="100%" >

            <Grid xs={6} md={5} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={`assets/${aUserBadgeProgression.badge_filename}`} sx={{ mr: 1 }} />
              <Typography variant="body2">{aUserBadgeProgression.badge_name}</Typography>
            </Grid>
            <Grid xs={6} md={7} sx={{ display: 'flex', alignItems: 'center', mb: 2, pl:4 }}>
              <BadgeChart aUserBadgeProgression={aUserBadgeProgression} maxCount={badgeCounts} />
            </Grid>
          </Grid>
        ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

