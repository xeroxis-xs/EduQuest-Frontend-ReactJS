import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Book as BookIcon } from '@phosphor-icons/react/dist/ssr/Book';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr/TrendDown';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp';

export interface TotalCourseProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function TotalCourse({ diff, trend, sx, value }: TotalCourseProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? TrendUpIcon : TrendDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: '24px' }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={3}>
            <Avatar sx={{ backgroundColor: 'white', height: '56px', width: '56px', boxShadow: '0 0 14px 0 rgba(0, 0, 0, 0.1), 0 0 0 0px rgba(0, 0, 0, 0.08)' }}>
              <BookIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
            </Avatar>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0}>
                <Typography color="text.secondary" variant="overline">
                  Course Enrolments
                </Typography>
                <Tooltip title="This represents the total number of new course enrolments." placement="right">
                  <InfoIcon fontSize="var(--icon-fontSize-sm)" style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--mui-palette-neutral-500)' }} />
                </Tooltip>
              </Stack>

              <Typography variant="h4">{value}</Typography>

              {diff ? (
                <Stack sx={{ alignItems: 'center', mt: '10px' }} direction="row" spacing={2}>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                    <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                    <Typography color={trendColor} variant="body2">
                      {diff}%
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="caption">
                    Since last week
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
