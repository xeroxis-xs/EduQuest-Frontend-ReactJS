import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import type {CourseGroup} from "@/types/course-group";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import {UserCourseGroupEnrollment} from "@/types/user-course-group-enrollment";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface CourseGroupCardProps {
  rows?: CourseGroup[];
  userCourseGroupEnrollments: UserCourseGroupEnrollment[];
  handleCourseGroupSelect: (courseGroupId: string) => void;
}

export function CourseGroupCard({ rows = [], userCourseGroupEnrollments, handleCourseGroupSelect }: CourseGroupCardProps): React.JSX.Element {
  const theme = useTheme();

  // Define media queries for different screen sizes
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  // Determine the number of items per row based on screen size
  let itemsPerRow = 6; // Default for large screens

  if (isXs) {
    itemsPerRow = 2; // 2 items per row for xs
  } else if (isSm) {
    itemsPerRow = 3; // 3 items per row for sm
  } else if (isMd) {
    itemsPerRow = 4; // 4 items per row for md
  } else if (isLg) {
    itemsPerRow = 4; // 6 items per row for lg and above
  }

  // Calculate rowsPerPage to match itemsPerRow
  const rowsPerPage = itemsPerRow;

  // Calculate the number of pages
  const pageCount = Math.ceil(rows.length / rowsPerPage);

  // State to track the current page
  const [page, setPage] = React.useState(1);

  // Determine the items to display on the current page
  const currentCourseGroups = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [rows, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  return (
    <Box>
      {/* Pagination Controls - only show if pageCount > 1 */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            color="primary"
            siblingCount={0} // Optional: Adjust pagination appearance
            boundaryCount={1} // Optional: Adjust pagination appearance
          />
        </Box>
      )}

      {/* Grid Container */}
      <Grid container spacing={2}>
        {currentCourseGroups.map((courseGroup) => (
          <Grid key={courseGroup.id} lg={3} md={3} sm={4} xs={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <CardActionArea
                sx={{
                  height: '100%',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onClick={() => { handleCourseGroupSelect(courseGroup.id.toString()); }}
              >
                {/* Card Header */}
                <CardHeader title={courseGroup.name} />

                {/* Card Content */}
                <CardContent sx={{ flex: 1, py: 1 }}>
                  <Typography variant="body2" align="center">
                    {courseGroup.session_day}
                  </Typography>
                  <Typography variant="body2" mb={1} align="center">
                    {courseGroup.session_time}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                    <UserIcon size={14} color={theme.palette.text.secondary} weight="bold"/>
                    <Typography variant="overline" color="text.secondary" align="center">
                      {courseGroup.instructor.nickname}
                    </Typography>
                  </Stack>
                </CardContent>

                {/* Card Actions */}
                <CardActions sx={{ justifyContent: 'space-between', display: 'flex' }}>
                  <Box
                    sx={{
                      mx: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      my: 1,
                    }}
                  >
                    <UsersIcon size={20} />
                    <Typography sx={{ marginLeft: '10px' }} variant="body1">
                      {courseGroup.total_students_enrolled}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mx: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      my: 1,
                    }}
                  >
                    {/* Check if the user is enrolled in the course group */}
                    {userCourseGroupEnrollments.some((enrollment) => enrollment.course_group_id === courseGroup.id) && (
                      // <CheckCircleIcon size={20} weight="fill" color={theme.palette.success.main} />
                      <Chip icon={<CheckIcon size={14}/>} label="Enrolled" color="success" size="small"/>

                  )}
                  </Box>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
