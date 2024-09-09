'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {Course} from "@/types/course";
import { useMemo } from 'react';

interface CourseTableProps {
  rows?: Course[];
  getCourseInsights: (id: number) => void;
}

interface GroupedCourse {
  id: number;
  term: {
    id: number;
    academic_year: {
      start_year: number;
      end_year: number;
    };
    name: string;
  };
  code: string;
  name: string;
  image: {
    filename: string;
  };
  groupCount: number;
  totalEnrolledUsers: number;
}

export function CourseTable({ rows = [], getCourseInsights }: CourseTableProps): React.JSX.Element {
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
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const handleViewUser = async (id: number): Promise<void> => {
    getCourseInsights(id);
  };

  const groupedRows = useMemo(() => {
    const grouped: Record<string, GroupedCourse> = {};

    rows.forEach(row => {
      const key = `${row.term.id.toString()}-${row.code}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: row.id,
          term: row.term,
          code: row.code,
          name: row.name,
          image: row.image,
          groupCount: 0,
          totalEnrolledUsers: 0,
        };
      }
      grouped[key].groupCount += 1;
      grouped[key].totalEnrolledUsers += row.enrolled_users.length;
    });

    return Object.values(grouped);
  }, [rows]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Groups</TableCell>
              <TableCell>Students</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => handleViewUser(row.id)}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <TableCell>
                  <Typography variant="body2">AY {row.term.academic_year.start_year} - {row.term.academic_year.end_year} {row.term.name}</Typography>
                </TableCell>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Box component="img" src={`/assets/${row.image.filename}`} sx={{ height: '24px', width: '24px' }} />
                    <Typography variant="body2">{row.code} {row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.groupCount}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.totalEnrolledUsers}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={groupedRows.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Card>
  );
}
