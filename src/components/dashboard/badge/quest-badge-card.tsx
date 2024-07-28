import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import type { Course } from '@/types/course';
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {CardMedia, Divider} from "@mui/material";
import { SignIn as SignInIcon } from "@phosphor-icons/react/dist/ssr/SignIn";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import {useUser} from "@/hooks/use-user";
import type {Badge} from "@/types/badge";
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
            <CardActionArea href={`/dashboard/badge/${questBadge.id.toString()}` } sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              {/*<CardHeader title={badge.name}/>*/}
              <CardMedia
                component="img"
                alt={questBadge.badge.image.name}
                image={`/assets/${questBadge.badge.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, backgroundColor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {questBadge.badge.name}
                </Typography>
                <Typography variant="body2">
                  Earned from: {questBadge.quest_attempted.quest}
                </Typography>
              </CardContent>
            </CardActionArea>
            {/*<Box>*/}
              {/*<Divider/>*/}
              {/*<CardActions sx={{ justifyContent: 'space-between'}}>*/}
              {/*  <Box sx={{ mx: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>*/}
              {/*    <UsersIcon size={20}/>*/}
              {/*    <Typography sx={{ marginLeft: '10px' }} variant="body1">*/}
              {/*      {course.enrolled_users.length.toString()}*/}
              {/*    </Typography>*/}
              {/*  </Box>*/}
              {/*  {eduquestUser && course.enrolled_users.find(user => user.user === eduquestUser?.id) ? (*/}
              {/*    <Button endIcon={<CheckIcon/>} disabled>Enrolled</Button>*/}
              {/*  ) : (*/}
              {/*    <Button endIcon={<SignInIcon/>} onClick={() => handleEnroll(course.id)}>Enroll</Button>*/}

              {/*  )}*/}

              {/*</CardActions>*/}
            {/*</Box>*/}

          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
