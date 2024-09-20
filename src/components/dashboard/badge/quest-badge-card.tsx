import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardMedia} from "@mui/material";
import type { UserQuestBadge } from "@/types/user-quest-badge";
import {formatTime} from "@/components/dashboard/overview/shortest-user";
import Points from "../../../../public/assets/point.svg";
import Stack from "@mui/material/Stack";
import RouterLink from "next/link";


interface QuestBadgeCardProps {
  questBadges?: UserQuestBadge[];
}

export function QuestBadgeCard({ questBadges = [] }: QuestBadgeCardProps): React.JSX.Element {
  return (
    <Box>
      <Grid container spacing={4}>
        {questBadges.map((questBadge) => (
          <Grid key={questBadge.id} lg={3} md={4} xs={12}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="card"
            >
                {/* Badge Image */}
                <CardMedia
                  component="img"
                  alt={questBadge.badge.image.name}
                  image={`/assets/${questBadge.badge.image.filename}`}
                  className="badge"
                />

                {/* Card Content */}
                <CardContent sx={{ flex: 1, '&:last-child': { paddingBottom: 1 } }}>
                  {/* Badge Name */}
                  <Typography variant="h6" mb={3} align="center">
                    {questBadge.badge.name}
                  </Typography>

                  {/* Group */}
                  <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                    <Typography variant="overline" color="text.secondary">
                      Group
                    </Typography>
                    <Typography variant="body2" mt="2px" align="right">
                      {questBadge.user_quest_attempt.quest.course_group.name}
                    </Typography>
                  </Stack>

                  {/* Quest */}
                  <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                    <Typography variant="overline" color="text.secondary">
                      Quest
                    </Typography>
                    <Typography
                      variant="body2"
                      mt="2px"
                      align="right"
                      component={RouterLink}
                      sx={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}
                      href={`/dashboard/quest/${questBadge.user_quest_attempt.quest.id.toString()}`}
                    >
                      {questBadge.user_quest_attempt.quest.name} from{' '}
                      {questBadge.user_quest_attempt.quest.course_group.course.code}{' '}
                      {questBadge.user_quest_attempt.quest.course_group.course.name}
                    </Typography>
                  </Stack>

                  {/* Points */}
                  <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                    <Typography variant="overline" color="text.secondary">
                      Points
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" mt="2px" align="right">
                        {questBadge.user_quest_attempt.total_score_achieved.toFixed(2)}
                      </Typography>
                      <Points height={18} />
                    </Stack>
                  </Stack>

                  {/* Time Taken */}
                  <Stack direction="row" justifyContent="space-between" mb={1} spacing={2}>
                    <Typography variant="overline" color="text.secondary">
                      Time Taken
                    </Typography>
                    <Typography variant="body2" mt="2px" align="right">
                      {formatTime(questBadge.user_quest_attempt.time_taken) || 'Not Available'}
                    </Typography>
                  </Stack>
                </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
