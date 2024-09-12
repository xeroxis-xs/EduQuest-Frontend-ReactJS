import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {Typography} from "@mui/material";
import {TrendUp as TrendUpIcon} from "@phosphor-icons/react/dist/ssr/TrendUp";

export function SkeletonRecentAchievements(): React.JSX.Element {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="Recent Achievements"
          avatar={
            <TrendUpIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />          }
          sx={{ pr: '10px' }}
        />
        <Tooltip title="The most recent achievements made by users." placement="top">
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: "var(--mui-palette-neutral-500)", marginTop: '16px' }} />
        </Tooltip>
      </Stack>
      <CardContent sx={{ height: '100%'}}>
        <Stack spacing={3} justifyContent="space-evenly" alignItems="center" height="100%">
          <Skeleton variant="rounded" width="100%" height={20}/>
          <Skeleton variant="rounded" width="100%" height={20}/>
          <Skeleton variant="rounded" width="100%" height={20}/>
          <Skeleton variant="rounded" width="100%" height={20}/>
          <Skeleton variant="rounded" width="100%" height={20}/>

        </Stack>
      </CardContent>
    </Card>
  );
}
