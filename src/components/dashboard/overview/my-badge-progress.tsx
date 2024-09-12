'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import type { SxProps } from '@mui/material/styles';
import Avatar from "@mui/material/Avatar";
import { Medal as MedalIcon } from '@phosphor-icons/react/dist/ssr/Medal';
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import {BadgeChart} from "@/components/dashboard/overview/chart/badge-chart";
import type { UserBadgeProgression } from "@/types/analytics/user-badge-progression";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {paths} from "@/paths";
import RouterLink from "next/link";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";

export interface MyEarnedBadgesProps {
  userBadgeProgression?: UserBadgeProgression[];
  sx?: SxProps;
}

export function MyBadgeProgress({ userBadgeProgression = [], sx }: MyEarnedBadgesProps): React.JSX.Element {
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
      <Tooltip title="The badges that you have earned so far." placement="top" >
        <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
      </Tooltip>
      </Stack>
      <CardContent sx={{ height: "100%", py:1, pb:0}}>
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          height="100%"
          px={1}
        >
        {userBadgeProgression.map((aUserBadgeProgression) => (
          <Stack alignItems="center" direction="row" key={aUserBadgeProgression.badge_id} justifyContent="center" width="100%">
            <Tooltip title={`${aUserBadgeProgression.badge_name} Badge`} placement="top">
              <Box component="img" src={`assets/${aUserBadgeProgression.badge_filename}`} sx={{ cursor: 'pointer', width: 34 }} />
            </Tooltip>
            <Box sx={{ flexGrow: 1 }}>
              <BadgeChart aUserBadgeProgression={aUserBadgeProgression} maxCount={badgeCounts} />
            </Box>
          </Stack>
        ))}
        </Stack>
      </CardContent>
      <CardActions sx={{justifyContent: "flex-end"}}>
        <Button size="small" endIcon={<CaretRightIcon/>} component={RouterLink} href={paths.dashboard.badge.my}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}

