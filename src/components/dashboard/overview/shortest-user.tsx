import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import {useRouter} from "next/navigation";
import CardHeader from "@mui/material/CardHeader";
import {Lightning as LightningIcon} from "@phosphor-icons/react/dist/ssr/Lightning";
import Grid from "@mui/material/Unstable_Grid2";
import { keyframes } from '@emotion/react';
import {type ShortestTimeUser} from "@/types/analytics/analytics-one";


export interface BudgetProps {
  sx?: SxProps;
  shortestTimeUser: ShortestTimeUser | null;
}

export function formatTime(milliseconds: number): string {

  // Calculate total seconds without rounding up
  const totalSeconds = Math.floor(milliseconds / 1000); // e.g., 156 seconds for 156693 ms

  // Calculate total minutes
  const totalMinutes = Math.floor(totalSeconds / 60); // e.g., 2 minutes

  // Calculate remaining seconds
  const seconds = totalSeconds % 60; // e.g., 36 seconds

  // Calculate total hours
  const totalHours = Math.floor(totalMinutes / 60); // e.g., 0 hours

  // Calculate remaining minutes after extracting hours
  const minutes = totalMinutes % 60; // e.g., 2 minutes

  // Calculate remaining milliseconds
  const ms = milliseconds % 1000; // e.g., 693 ms

  const parts: string[] = [];

  // Add hours to parts if greater than 0
  if (totalHours > 0) {
    parts.push(`${totalHours.toString()} hr${totalHours > 1 ? 's' : ''}`);
  }

  // Add minutes to parts if greater than 0
  if (minutes > 0) {
    parts.push(`${minutes.toString()} min${minutes > 1 ? 's' : ''}`);
  }

  // Add seconds to parts if greater than 0
  if (seconds > 0) {
    parts.push(`${seconds.toString()} sec${seconds > 1 ? 's' : ''}`);
  }

  // Add milliseconds to parts only if there are no hours
  if (ms > 0 && totalHours === 0) {
    parts.push(`${ms.toString()} ms`);
  }

  // If all components are zero, return "0 ms"
  if (parts.length === 0) {
    return "0 ms";
  }

  // Ensure the result contains at most 3 components
  return parts.slice(0, 3).join(' ');
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
          <Typography variant="body2" align="center">No User</Typography>
        )}
      </CardContent>
    </Card>
  );
}
