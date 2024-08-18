import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Divider from "@mui/material/Divider";
import {Book as BookIcon} from "@phosphor-icons/react/dist/ssr/Book";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export function SkeletonMyBadgeProgress(): React.JSX.Element {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="My Badges"
          avatar={
            <BookIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title="The progress of the course that you have enrolled." placement="bottom" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>
      <Divider />
      <CardContent sx={{ height: "100%"}}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          height="100%"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Grid container spacing={2} key={index} width="100%" >

              <Grid xs={6} md={5} sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ width: '100%' }}><Skeleton/></Typography>
              </Grid>
              <Grid xs={6} md={7} sx={{ display: 'flex', alignItems: 'center', mb: 3, pl:4, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ width: '100%' }}><Skeleton/></Typography>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </CardContent>


    </Card>
  );
}
