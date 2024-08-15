'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from "@mui/material/Avatar";
import { Medal as MedalIcon } from '@phosphor-icons/react/dist/ssr/Medal';
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import {BadgeChart} from "@/components/dashboard/overview/chart/badge-chart";

export interface Badge {
  name: string;
  image: string;
  count: number;
}

export interface MyEarnedBadgesProps {
  badges?: Badge[];
  sx?: SxProps;
}

export function MyEarnedBadges({ badges = [], sx }: MyEarnedBadgesProps): React.JSX.Element {
  const badgeCounts = badges.map(badge => badge.count);

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
      <Table sx={{mb: 2}}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {badges.map((badge) => (
            <TableRow key={badge.name}>
              <TableCell sx={{ borderBottom: "none", display: 'flex', alignItems: 'center', pr:0 }}>
                <Avatar src={badge.image} sx={{ marginRight: 2 }} />
                {badge.name}
              </TableCell>
              <TableCell sx={{ width: '45%', borderBottom: "none", pl: '8px' }}>
                <BadgeChart badge={badge} maxCount={badgeCounts} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

