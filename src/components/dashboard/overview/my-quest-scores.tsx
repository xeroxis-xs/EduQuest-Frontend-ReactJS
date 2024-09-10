'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import {Book as BookIcon} from "@phosphor-icons/react/dist/ssr/Book";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Stack from "@mui/material/Stack";
import type { UserCourseProgression } from "@/types/analytics/user-course-progression";
import Typography from "@mui/material/Typography";

export interface MyEnrolledCoursesProps {
  userCourseProgression: UserCourseProgression | null;
  sx?: SxProps;
}

export function MyQuestScores({ userCourseProgression, sx }: MyEnrolledCoursesProps): React.JSX.Element {


  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title="My Quests"
          avatar={
              <BookIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title="The score achieved for each quests." placement="top" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        { userCourseProgression ? (
          <Typography variant="body2">
            { userCourseProgression.course_id }
          </Typography>
        ) : (
          <Typography variant="subtitle2" align="center" mt={4}>No data available.</Typography>
        ) }
      </Box>

    </Card>
  );
}
