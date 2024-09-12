import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {Info as InfoIcon} from "@phosphor-icons/react/dist/ssr/Info";
import CardContent from "@mui/material/CardContent";
import type {SxProps} from "@mui/material/styles";
import {Sword as SwordIcon} from "@phosphor-icons/react/dist/ssr/Sword";

interface SkeletonMyQuestScoresProps {
  sx?: SxProps;
  title: string;
  tooltip: string;
}


export function SkeletonMyQuestScores({ sx, title, tooltip }: SkeletonMyQuestScoresProps): React.JSX.Element {
  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
        <CardHeader
          title={title}
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
        <Stack spacing={3}>
            <Skeleton  variant="rounded" height={20}/>

          </Stack>
      </CardContent>

    </Card>
  );
}
