import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import {Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import CardHeader from "@mui/material/CardHeader";
import {Lightning as LightningIcon} from "@phosphor-icons/react/dist/ssr/Lightning";
import Grid from "@mui/material/Unstable_Grid2";

export function SkeletonShortestUser(): React.JSX.Element {
  return (
    <Card >
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

          <Stack>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', pb: 3 }} spacing={1} >
              <UserIcon fontSize="var(--icon-fontSize-md)" />
              <Skeleton variant="rounded" height={30} width={200}/>
            </Stack>
            <Grid container spacing={3} justifyContent="center">
              <Grid xs={6}>
                <Typography variant="overline" color="text.secondary">
                  Quest
                </Typography>
                <Typography variant="body2" >
                  <Skeleton/>
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="overline" color="text.secondary">
                  Time Taken
                </Typography>
                <Typography variant="body2"><Skeleton/></Typography>
              </Grid>
            </Grid>
          </Stack>
      </CardContent>
    </Card>
  );
}
