import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from "@mui/material/CardActionArea";
import {CardMedia} from "@mui/material";
import {UserQuestBadge} from "@/types/user-quest-badge";

interface QuestBadgeCardProps {
  questBadges?: UserQuestBadge[];
}

export function QuestBadgeCard({ questBadges = [] }: QuestBadgeCardProps): React.JSX.Element {

  return (
    <Box>

      <Grid container spacing={4}>

      {questBadges.map((questBadge) => (
        <Grid key={questBadge.id} lg={3} md={4} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea href='#' sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>

              <CardMedia
                component="img"
                alt={questBadge.badge.image.name}
                image={`/assets/${questBadge.badge.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, backgroundColor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" mb={3} align="center">
                  {questBadge.badge.name}
                </Typography>
                <Typography variant="overline" color="text.secondary">
                  Term
                </Typography>
                <Typography variant="body2" mb={2}>
                  AY {questBadge.quest_attempted.quest.from_course.term.academic_year.start_year}-{questBadge.quest_attempted.quest.from_course.term.academic_year.end_year} {questBadge.quest_attempted.quest.from_course.term.name}
                </Typography>

                <Typography variant="overline" color="text.secondary">
                  Source
                </Typography>
                <Typography variant="body2">
                  {questBadge.quest_attempted.quest.name} in {questBadge.quest_attempted.quest.from_course.code} {questBadge.quest_attempted.quest.from_course.name}
                </Typography>
              </CardContent>
            </CardActionArea>

          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
