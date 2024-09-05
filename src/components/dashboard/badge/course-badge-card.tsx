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
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="card">
            <CardActionArea href='#' sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <CardMedia
                component="img"
                alt={courseBadge.badge.image.name}
                image={`/assets/${courseBadge.badge.image.filename}`}
                className="badge"
              />
              <CardContent>

                <Typography variant="h6" mb={3} align="center">
                    {courseBadge.badge.name}
                  </Typography>
                <Typography variant="overline" color="text.secondary">
                  Term
                </Typography>
                <Typography variant="body2" mb={2}>
                  AY {courseBadge.course_completed.course.term.academic_year.start_year}-{courseBadge.course_completed.course.term.academic_year.end_year} {courseBadge.course_completed.course.term.name}
                </Typography>

                  <Typography variant="overline" color="text.secondary">
                    Source
                  </Typography>
                  <Typography variant="body2">
                    {courseBadge.course_completed.course.code} {courseBadge.course_completed.course.name}
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
