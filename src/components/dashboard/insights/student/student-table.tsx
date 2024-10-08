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

import { type EduquestUser } from '@/types/eduquest-user';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Points from "../../../../../public/assets/point.svg";

interface UserTableProps {
  rows?: EduquestUser[];
  handleUserSelection: (id: number) => void;
}

export function StudentTable({ rows = [], handleUserSelection }: UserTableProps): React.JSX.Element {
  const [activeRow, setActiveRow] = React.useState<number | null>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  const handleRowClick = (id: number): void => {
    setActiveRow(id);
    handleUserSelection(id);
  };


  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => { handleRowClick(row.id); }}
                  sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeRow === row.id ? 'rgba(0, 0, 0, 0.08)' : 'inherit'
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" color="text.secondary" >
                        {row.total_points.toFixed(2)}
                      </Typography>
                      <Points height={18}/>
                    </Stack>
                  </TableCell>
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
        rowsPerPageOptions={[10, 15, 20]}
      />
    </Card>
  );
}
