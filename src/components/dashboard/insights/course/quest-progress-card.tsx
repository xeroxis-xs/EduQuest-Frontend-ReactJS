'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import {Sword as SwordIcon} from "@phosphor-icons/react/dist/ssr/Sword";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import Stack from "@mui/material/Stack";
import type { Quest } from "@/types/analytics/analytics-four";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import {StudentsScoreBarChart} from "@/components/dashboard/overview/chart/students-score-bar-chart";
import {ZeroMaxScoreChart} from "@/components/dashboard/overview/chart/ZeroMaxScoreChart";

export interface QuestProgressCardProps {
  questProgress: Quest | null;
}

export function QuestProgressCard({ questProgress }: QuestProgressCardProps): React.JSX.Element {


  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title={`${questProgress ? questProgress.quest_name : "Quest"}'s Completion`}
          avatar={
              <SwordIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title="The highest sccore achieved by each student. If the bar is not present, the student did not attempt the quest." placement="top" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>

      <CardContent sx={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        { questProgress && questProgress.students_progress?.length > 0 ? (
          <Stack>
            { questProgress.quest_max_score === 0 ?
              <ZeroMaxScoreChart questProgress={questProgress} />
              :
              <StudentsScoreBarChart questProgress={questProgress}/>
            }

          </Stack>
        ) :  questProgress ?
            <Typography variant="body2" align="center" pb={3}>This quest does not have any attempt yet</Typography>
            :
          <Typography variant="body2" align="center" pb={3}>Select a quest to view its completion progress</Typography>
         }
      </CardContent>

    </Card>
  );
}
