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
import apiService from "@/api/api-service";

import { type EduquestUser } from '@/types/eduquest-user';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {logger} from "@/lib/default-logger";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import type {Course} from "@/types/course";

interface UserTableProps {
  rows?: EduquestUser[];
}

export function UserTable({
  rows = [],
}: UserTableProps): React.JSX.Element {
  // const rowIds = React.useMemo(() => {
  //   return rows.map((eduquestUser) => eduquestUser.id);
  // }, [rows]);

  // const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  //
  // const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  // const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

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

  const handleViewUser = async (id: number): Promise<void> => {
    logger.debug('handleViewUser', id);
    await getCourseInsights(id);
  };

  const getCourseInsights = async (id: number): Promise<void> => {
    try {
      const response = await apiService.get<Course[]>(`/api/Course/${id.toString()}`);
      logger.debug('response', response);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to load course insights', error);
    }
  };

  return (
    <Stack spacing={4}>
    <Typography variant="body1">Total number of users in the system: {rows?.length}</Typography>

    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => handleViewUser(row.id)}
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={rows.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[15, 20, 25]}
      />
    </Card>
    </Stack>
  );
}
