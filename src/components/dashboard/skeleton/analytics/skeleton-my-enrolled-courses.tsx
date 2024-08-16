import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Divider from "@mui/material/Divider";
import {TablePagination, Typography} from "@mui/material";
import {Book as BookIcon} from "@phosphor-icons/react/dist/ssr/Book";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {noop} from "@babel/types";

export function SkeletonMyEnrolledCourses(): React.JSX.Element {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow hover key={index} >
                <TableCell sx={{ borderBottom: "none", pr:0 }}><Typography variant="subtitle1"><Skeleton/></Typography></TableCell>
                <TableCell sx={{ borderBottom: "none", pr:0 }}><Typography variant="subtitle1"><Skeleton/></Typography></TableCell>
                <TableCell sx={{ width: '40%', borderBottom: "none" }}>
                  <Typography variant="subtitle1"><Skeleton/></Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={0} // Arbitrary value for skeleton
        page={0} // Arbitrary value for skeleton
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={() => {noop()}} // No-op function for skeleton
        onRowsPerPageChange={() => {noop()}} // No-op function for skeleton
      />
    </Card>
  );
}
