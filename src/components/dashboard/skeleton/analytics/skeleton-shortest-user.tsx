import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Crown as CrownIcon } from '@phosphor-icons/react/dist/ssr/Crown';
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";

export function SkeletonShortestUser(): React.JSX.Element {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: '24px' }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={3}>
            <Avatar sx={{ backgroundColor: 'white', height: '56px', width: '56px', boxShadow: '0 0 14px 0 rgba(0, 0, 0, 0.1), 0 0 0 0px rgba(0, 0, 0, 0.08)' }}>
              <CrownIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
            </Avatar>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
                <Typography color="text.secondary" variant="overline">
                  Goat
                </Typography>
                <Tooltip title="Greatest Of All Time: User with a perfect score and fastest time." placement="right">
                  <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>

              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                <UserIcon fontSize="var(--icon-fontSize-md)"/>
                <Typography variant="h6"><Skeleton/></Typography>
              </Stack>
              <Typography variant="body2"><Skeleton/></Typography>
              <Typography variant="body2"><Skeleton/></Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
