import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from "@mui/material/CardActionArea";
import {CardMedia} from "@mui/material";
import type {UserCourseBadge} from "@/types/user-course-badge";

interface CourseBadgeCardProps {
  courseBadges?: UserCourseBadge[];
}

export function CourseBadgeCard({ courseBadges = [] }: CourseBadgeCardProps): React.JSX.Element {

  return (
    <Box>

      <Grid container spacing={4}>

      {courseBadges.map((courseBadge) => (
        <Grid key={courseBadge.id} lg={3} md={4} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea href='#' sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <CardMedia
                component="img"
                alt={courseBadge.badge.image.name}
                image={`/assets/${courseBadge.badge.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, backgroundColor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {courseBadge.badge.name}
                </Typography>
                <Typography variant="body2">
                  Earned from: {courseBadge.course_completed.course}
                </Typography>
              </CardContent>
            </CardActionArea>

          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
