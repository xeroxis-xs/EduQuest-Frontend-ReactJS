'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CourseChart } from "@/components/dashboard/overview/chart/course-chart";
import {Book as BookIcon} from "@phosphor-icons/react/dist/ssr/Book";
import { TablePagination } from '@mui/material';
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Stack from "@mui/material/Stack";
import {UserCourseProgression} from "@/types/analytics/user-course-progression";


export interface Course {
  id: string;
  code: string;
  name: string;
  term: string;
  quests: number;
  completed: number;
}

export interface MyEnrolledCoursesProps {
  userCourseProgression?: UserCourseProgression[];
  sx?: SxProps;
}

export function MyEnrolledCourses({ userCourseProgression = [], sx }: MyEnrolledCoursesProps): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) : void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) : void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="My Courses"
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
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCourseProgression.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((aUserCourseProgression) => (
              <TableRow hover key={aUserCourseProgression.course_id} >
                <TableCell sx={{ borderBottom: "none", pr:0 }}>{aUserCourseProgression.course_term}</TableCell>
                <TableCell sx={{ borderBottom: "none", pr:0 }}>{aUserCourseProgression.course_name}</TableCell>
                <TableCell sx={{ width: '40%', borderBottom: "none" }}>
                  <CourseChart aUserCourseProgression={aUserCourseProgression}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {/*<Divider/>*/}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={userCourseProgression.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
