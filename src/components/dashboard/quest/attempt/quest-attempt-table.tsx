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
import RouterLink from "next/link";
import type { UserQuestAttempt } from '@/types/user-quest-attempt';
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

interface UserQuestAttemptTableProps {
  questId?: string;
  rows?: UserQuestAttempt[];
  totalMaxScore?: number;
}

export function UserQuestAttemptTable({ questId = '0', rows = [], totalMaxScore = 0 }: UserQuestAttemptTableProps): React.JSX.Element {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const formatTime = (milliseconds:number) => {
    const oneSecond = 1000;
    const oneMinute = 60 * oneSecond;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;

    const days = Math.floor(milliseconds / oneDay);
    const daysRemainder = milliseconds % oneDay;
    const hours = Math.floor(daysRemainder / oneHour);
    const hoursRemainder = daysRemainder % oneHour;
    const minutes = Math.floor(hoursRemainder / oneMinute);
    const minutesRemainder = hoursRemainder % oneMinute;
    const seconds = Math.floor(minutesRemainder / oneSecond);
    const millisecondsLeft = minutesRemainder % oneSecond;

    return `${days.toString()}d ${hours.toString()}h ${minutes.toString()}m ${seconds.toString()}s ${millisecondsLeft.toString()}ms`;
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Attempted On</TableCell>
              <TableCell>Last Attempted On</TableCell>
              <TableCell>Time Taken</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {new Date(row.first_attempted_on).toLocaleString("en-SG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(row.last_attempted_on).toLocaleString("en-SG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>{formatTime(row.time_taken)}</TableCell>
                  <TableCell>
                    <Chip label={row.submitted ? "Submitted" : "In Progress"} color={row.submitted ? "success" : "warning"} size="small"/>
                  </TableCell>
                  <TableCell>
                    {row.submitted ? `${parseFloat(row.total_score_achieved.toFixed(2)).toString()} / ${totalMaxScore?.toString()}` : "In Progress"}
                    {row.submitted &&
                    <LinearProgress
                      variant="determinate"
                      value={(row.total_score_achieved / totalMaxScore) * 100}
                    />}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={RouterLink}
                      href={`/dashboard/quest/${questId}/quest-attempt/${row.id.toString()}`}>
                      {row.submitted ? "View" : "Continue"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
