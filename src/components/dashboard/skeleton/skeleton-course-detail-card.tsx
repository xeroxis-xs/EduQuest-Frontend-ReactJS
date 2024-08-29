import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

export function SkeletonCourseDetailCard(): React.JSX.Element {
  return (

    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardHeader
        title={<Skeleton width="60%" />} sx={{my: 1}}
      />
      <Skeleton variant="rectangular" height={160} sx={{ backgroundColor: '#fafafa' }} />
      <CardContent sx={{ flex: 1 }}>
        <Grid container spacing={3}>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="20%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="20%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="20%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="20%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="20%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="90%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="60%" /> </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <Typography variant="subtitle2"> <Skeleton width="40%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="90%" /> </Typography>
            <Typography variant="body2"> <Skeleton width="60%" /> </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Box>
        {/*<Divider />*/}
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Skeleton width="10%" sx={{my: 1}} />
          <Skeleton width="10%" />
        </CardActions>
      </Box>
    </Card>

  );
}
