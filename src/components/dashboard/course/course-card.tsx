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
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {CardMedia, Divider} from "@mui/material";
import { SignIn as SignInIcon } from "@phosphor-icons/react/dist/ssr/SignIn";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import {useUser} from "@/hooks/use-user";
import RouterLink from "next/link";

interface CourseCardProps {
  rows?: Course[];
  onEnrolledSuccess: () => void;
}

export function CourseCard({ rows = [], onEnrolledSuccess }: CourseCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const { eduquestUser } = useUser();
  const rowsPerPage = 6;

  // Calculate the number of pages
  const pageCount = Math.ceil(rows.length / rowsPerPage);

  // Calculate the items to be displayed on the current page
  const currentCourses = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleEnroll = async (courseId:number) => {
    try {
      const data = {
        user: eduquestUser?.id,
        course: courseId
      }
      const response = await apiService.post(`/api/UserCourse/`, data);
      if (response.status === 201) {
        logger.debug('Enrolled successfully');
        onEnrolledSuccess();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error enrolling: ', error);
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      <Grid container spacing={4}>

      {currentCourses.map((course) => (
        <Grid key={course.id} lg={4} md={6} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea href={`/dashboard/course/${course.id.toString()}` } sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} component={RouterLink}>
              <CardHeader title={course.name} subheader={course.code}/>
              <CardMedia
                component="img"
                alt={course.image.name}
                image={`/assets/${course.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Chip label={course.type} sx={{ mb: 1.5, mr: 1 }} color={
                  course.type === 'Private' ? 'default' :
                    course.type === 'Eduquest' ? 'primary' :
                      course.type === 'Others' ? 'default' : 'default'
                } size="small" variant="outlined"/>
                <Chip label={course.status} sx={{ mb: 1.5 }} color={
                  course.status === 'Draft' ? 'default' :
                    course.status === 'Active' ? 'success' :
                      course.status === 'Expired' ? 'default' : 'default'
                } size="small" variant="outlined"/>
                <Typography variant="subtitle1" mb={1}>
                  AY {course.term.academic_year.start_year}-{course.term.academic_year.end_year} {course.term.name}
                </Typography>
                <Typography variant="body2">
                  {course.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Box>
              <Divider/>
              <CardActions sx={{ justifyContent: 'space-between'}}>
                <Box sx={{ mx: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <UsersIcon size={20}/>
                  <Typography sx={{ marginLeft: '10px' }} variant="body1">
                    {course.enrolled_users.length.toString()}
                  </Typography>
                </Box>
                {eduquestUser && course.enrolled_users.find(user => user.user === eduquestUser?.id) ? (
                  <Button endIcon={<CheckIcon/>} disabled>Enrolled</Button>
                ) : (
                  <Button endIcon={<SignInIcon/>} onClick={() => handleEnroll(course.id)}>Enroll</Button>

                )}

              </CardActions>
            </Box>

          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
