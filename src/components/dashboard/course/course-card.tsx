import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import type { Course } from '@/types/course';
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";

interface CourseCardProps {
  rows?: Course[];
}

export function CourseCard({
                             rows = [],
                           }: CourseCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  // Calculate the number of pages
  const pageCount = Math.ceil(rows.length / rowsPerPage);

  // Calculate the items to be displayed on the current page
  const currentCourses = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      <Grid container spacing={4}>

      {currentCourses.map((course) => (
        <Grid key={course.id} lg={4} md={6} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea sx={{ height: '100%'}} href={`/dashboard/course/${course.id.toString()}`}>
            <CardHeader title={course.name}/>
              <CardContent>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {course.code}
                </Typography>
                <Chip label={course.status} sx={{ mb: 1.5 }} color="success" size="small"/>
                <Typography variant="subtitle1">
                  AY {course.term.academic_year.start_year}-{course.term.academic_year.end_year}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                  {course.term.name}
                </Typography>
                <Typography variant="body2">
                  {course.description}
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
