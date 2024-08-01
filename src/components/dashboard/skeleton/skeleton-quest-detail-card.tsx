import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

export function SkeletonQuestDetailCard(): React.JSX.Element {
  return (

    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardHeader
        title={<Skeleton width="60%" />} sx={{my: 1}}
      />
      <Skeleton variant="rectangular" height={160} sx={{ backgroundColor: '#fafafa' }} />
      <CardContent sx={{ flex: 1, mb: 2}}>
        <Grid container spacing={3}>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Skeleton width="20%" height={60}/>
      </CardActions>
    </Card>

  );
}
