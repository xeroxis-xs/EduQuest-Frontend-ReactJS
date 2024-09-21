import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardMedia} from "@mui/material";
import type {UserCourseBadge} from "@/types/user-course-badge";
import Stack from "@mui/material/Stack";
import RouterLink from "next/link";

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
            <CardMedia
              component="img"
              alt={courseBadge.badge.image.name}
              image={`/assets/${courseBadge.badge.image.filename}`}
              className="badge"
            />
            <CardContent sx={{ flex: 1, '&:last-child': { paddingBottom: 1 } }}>
              <Typography variant="h6" mb={3} align="center">
                {courseBadge.badge.name}
              </Typography>

              <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                <Typography variant="overline" color="text.secondary">
                  Group
                </Typography>
                <Typography variant="body2" mt="2px" align="right">
                  {courseBadge.user_course_group_enrollment.course_group.name}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                <Typography variant="overline" color="text.secondary">
                  Course
                </Typography>
                <Typography
                  variant="body2"
                  mt="2px"
                  align="right"
                  component={RouterLink}
                  sx={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}
                  href={`/dashboard/course/${courseBadge.user_course_group_enrollment.course_group.course.id.toString()}`}
                >
                  {courseBadge.user_course_group_enrollment.course_group.course.code} {courseBadge.user_course_group_enrollment.course_group.course.name}
                </Typography>
              </Stack>


            </CardContent>

          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
