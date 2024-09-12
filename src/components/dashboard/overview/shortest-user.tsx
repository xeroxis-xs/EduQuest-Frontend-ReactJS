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
import CardHeader from "@mui/material/CardHeader";
import {Lightning as LightningIcon} from "@phosphor-icons/react/dist/ssr/Lightning";
import Grid from "@mui/material/Unstable_Grid2";
import { keyframes } from '@emotion/react';


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

  // Define keyframe animation
  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
`;


  return (
    <Card sx={sx}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="Ultimate Speedster"
          avatar={
            <LightningIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px' }}
        />
        <Tooltip title="User who has achieved both the fastest time and a perfect score" placement="top">
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: "var(--mui-palette-neutral-500)", marginTop: '16px' }} />
        </Tooltip>
      </Stack>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 1 }}>
        {shortestTimeUser ? (
          <Stack>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', pb: 3, animation: `${fadeIn} 1s ease-in-out` }} spacing={1} >
              <UserIcon fontSize="var(--icon-fontSize-md)" />
              <Typography variant="h6" align="center">
                {shortestTimeUser.nickname}
              </Typography>
            </Stack>
            <Grid container spacing={3} justifyContent="center">
              <Grid xs={6}>
                <Typography variant="overline" color="text.secondary">
                  Quest
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => { handleRouteToQuest(shortestTimeUser.quest_id.toString())}}>
                  {shortestTimeUser.quest_name} from {shortestTimeUser.course}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="overline" color="text.secondary">
                  Time Taken
                </Typography>
                <Typography variant="body2">{formatTime(shortestTimeUser.time_taken)}</Typography>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Typography variant="body2">No User</Typography>
        )}
      </CardContent>
    </Card>
  );
}
