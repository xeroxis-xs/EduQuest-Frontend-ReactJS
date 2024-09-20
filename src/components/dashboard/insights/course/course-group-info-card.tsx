'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CourseGroup } from "@/types/analytics/analytics-four";
import CardHeader from "@mui/material/CardHeader";
import {Book as BookIcon} from "@phosphor-icons/react/dist/ssr/Book";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import CardContent from "@mui/material/CardContent";
import {QuestScoreChart} from "@/components/dashboard/overview/chart/quest-completion-chart";

interface CourseGroupInfoCardProps {
  groupProgress: CourseGroup | null;

}
export function CourseGroupInfoCard({ groupProgress }: CourseGroupInfoCardProps): React.JSX.Element {


  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title={`${groupProgress ? groupProgress.group_name: "Group"}'s Progress`}
          avatar={
            <BookIcon color="var(--mui-palette-primary-main)" />
          }
          sx={{ pr: '10px'}}
        />
        <Tooltip title="The progress of each quests in the selected course group" placement="top" >
          <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '0px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)', marginTop: '16px'}} />
        </Tooltip>
      </Stack>
      <CardContent sx={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>

        { groupProgress ?
          <Stack>
            { groupProgress.quests.length === 0 ?
              <Typography variant="body2" align="center" pb={3}>
                This course group does not have any quests yet
              </Typography>
             : <QuestScoreChart groupProgress={groupProgress} />
            }
          </Stack>
          :
          <Typography variant="body2" align="center" mt={4}>Select a coruse group to view its progress</Typography>
        }
      </CardContent>
    </Card>
  );
}

