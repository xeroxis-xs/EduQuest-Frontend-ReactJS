'use client';

import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

import { type EduquestUser } from '@/types/eduquest-user';

function noop(): void {
  // do nothing
}

// export interface EduquestUser {
//   id: string;
//   avatar: string;
//   name: string;
//   email: string;
//   address: { city: string; state: string; country: string; street: string };
//   phone: string;
//   createdAt: Date;
// }

interface EduquestUserTableProps {
  count?: number;
  page?: number;
  rows?: EduquestUser[];
  rowsPerPage?: number;
}

export function EduquestUserTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: EduquestUserTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((eduquestUser) => eduquestUser.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {row.id}
                    {/*<Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>*/}
                    {/*  <Avatar src={row.avatar} />*/}
                    {/*  <Typography variant="subtitle2">{row.name}</Typography>*/}
                    {/*</Stack>*/}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {/*{row.address.city}, {row.address.state}, {row.address.country}*/}
                    {row.username}
                  </TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  {/*<TableCell>{row.phone}</TableCell>*/}
                  {/*<TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>*/}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
