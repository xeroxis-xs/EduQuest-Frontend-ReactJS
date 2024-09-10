import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Crown as CrownIcon } from '@phosphor-icons/react/dist/ssr/Crown';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import type {ShortestTimeUser} from "@/types/analytics/shortest-time-user";
import Box from "@mui/material/Box";
import {useRouter} from "next/navigation";

export interface BudgetProps {
  sx?: SxProps;
  shortestTimeUser: ShortestTimeUser | null;
}

export function formatTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.round(milliseconds % 1000);

  const parts = [];
  if (hours > 0) parts.push(`${hours.toString()} hr`);
  if (minutes > 0) parts.push(`${minutes.toString()} min`);
  if (seconds > 0) parts.push(`${seconds.toString()} sec`);
  if (ms > 0) parts.push(`${ms.toString()} ms`);

  return parts.join(' ');
}

export function ShortestUser ({ sx, shortestTimeUser }: BudgetProps): React.JSX.Element {
  const router = useRouter();
  const handleRouteToQuest = (questId: string): void => {
    router.push(`/dashboard/quest/${questId}`);
  };


  return (
    <Card sx={sx}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: '24px' }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
            <Avatar sx={{ backgroundColor: 'white', height: '56px', width: '56px' }}>
              <CrownIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
            </Avatar>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
                <Typography color="text.secondary" variant="overline">
                  G.o.a.t.
                </Typography>
                <Tooltip title="Greatest Of All Time: User with a perfect score and fastest time." placement="top">
                  <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>
              {shortestTimeUser ? (
                <>
                  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                    <UserIcon fontSize="var(--icon-fontSize-md)"/>
                    <Typography variant="h6">{shortestTimeUser.nickname}</Typography>
                  </Stack>
                  <Typography variant="body2">
                    Quest:
                    <Box
                      component="span"
                      sx={{ display: 'inline', cursor: 'pointer', mx: '6px', fontWeight: '600' }}
                      onClick={() => { handleRouteToQuest(shortestTimeUser.quest_id.toString()); }}
                    >
                    {shortestTimeUser.quest_name}
                    </Box>
                    from {shortestTimeUser.course}
                  </Typography>
                  <Typography variant="body2">Time Taken: {formatTime(shortestTimeUser.time_taken)}</Typography>
                </>
              ) : (
                <Typography variant="body2">No User</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
