import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Sword as SwordIcon } from '@phosphor-icons/react/dist/ssr/Sword';

export function SkeletonTotalQuest(): React.JSX.Element {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: '24px' }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
            <Avatar sx={{ backgroundColor: 'white', height: '56px', width: '56px' }}>
              <SwordIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
            </Avatar>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
                <Typography color="text.secondary" variant="overline">
                  Quest Attempts
                </Typography>
                <Tooltip title="This represents the total number of quest attempts by users (excluding 'Private' quests)." placement="right">
                  <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>

              <Skeleton variant="circular" width={40} height={40} />

              <Typography variant="body2">
                <Skeleton/>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
