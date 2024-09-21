'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import type { SxProps } from '@mui/material/styles';
import {Sword as SwordIcon} from "@phosphor-icons/react/dist/ssr/Sword";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Stack from "@mui/material/Stack";
import type { UserCourseProgression } from "@/types/analytics/analytics-two";
import Typography from "@mui/material/Typography";
import {QuestScoreBarChart} from "@/components/dashboard/overview/chart/quest-score-bar-chart";
import CardContent from "@mui/material/CardContent";

export interface MyEnrolledCoursesProps {
  userCourseProgression: UserCourseProgression | null;
  sx?: SxProps;
  title: string;
  prompt: string;
  tooltip: string;
  chartAutoHeight: boolean;
}

export function QuestScoresCard({ userCourseProgression, sx, title, prompt, tooltip, chartAutoHeight }: MyEnrolledCoursesProps): React.JSX.Element {


  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title={title}
          // subheader="The highest score you have achieved for each quests"
          avatar={
              <SwordIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title={tooltip} placement="top" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>

      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingY: 1, '&:last-child': { paddingBottom: 0 }  }}>
        { userCourseProgression && userCourseProgression.quest_scores?.length > 0 ? (
          <Stack>
            <Typography variant="body2" align="center">
              {userCourseProgression.course_code} {userCourseProgression.course_name}
            </Typography>
            <QuestScoreBarChart aUserCourseProgression={userCourseProgression} chartAutoHeight={chartAutoHeight}/>
          </Stack>
        ) :  userCourseProgression ?
            <Typography variant="body2" align="center" pb={3}>This course does not have any quest setup yet</Typography>
            :
          <Typography variant="body2" align="center" pb={3}>{prompt}</Typography>
         }
      </CardContent>

    </Card>
  );
}
