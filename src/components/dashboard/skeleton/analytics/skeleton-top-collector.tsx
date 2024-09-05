import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import {Ranking as RankingIcon} from "@phosphor-icons/react/dist/ssr/Ranking";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";

export function SkeletonTopCollector(): React.JSX.Element {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="Top Collectors"
          avatar={
              <RankingIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title="Top 5 users with the most badges. " placement="top" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>
      <CardContent sx={{ height: '100%'}}>
        <Stack spacing={3} justifyContent="space-evenly" alignItems="center" height="100%">
          <Skeleton variant="rectangular" width="100%" height={40}/>
          <Skeleton variant="rectangular" width="100%" height={40}/>
          <Skeleton variant="rectangular" width="100%" height={40}/>
          <Skeleton variant="rectangular" width="100%" height={40}/>
          <Skeleton variant="rectangular" width="100%" height={40}/>

        </Stack>
      </CardContent>
    </Card>
  );
}
