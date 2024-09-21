'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import type { SxProps } from '@mui/material/styles';
import { Ranking as RankingIcon } from '@phosphor-icons/react/dist/ssr/Ranking';
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import {TopCollectorBarChart} from "@/components/dashboard/overview/chart/top-collector-bar-chart";
import CardContent from "@mui/material/CardContent";
import type { TopCollector } from "@/types/analytics/top-collector";
import Typography from "@mui/material/Typography";


export interface TopCollectorsProps {
  topCollectors?: TopCollector[];
  sx?: SxProps;
}

export function TopCollectors({ topCollectors = [], sx }: TopCollectorsProps): React.JSX.Element {
  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column'}}>
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
      <CardContent sx={{  justifyContent: 'center', paddingTop: 0, '&:last-child': { paddingBottom: 0 }  }}>
        { topCollectors?.length > 0 ? (
          <TopCollectorBarChart topCollectors={topCollectors}/>
        ) : (
          <Typography variant="subtitle2" align="center" mt={4}>No data available.</Typography>
        )}

      </CardContent>


    </Card>
  );
}

