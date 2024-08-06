import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import CardActionArea from "@mui/material/CardActionArea";
import {CardMedia} from "@mui/material";
import type {Badge} from "@/types/badge";
import Stack from "@mui/material/Stack";


interface BadgeCardProps {
  badges?: Badge[];
}

export function BadgeCard({ badges = [] }: BadgeCardProps): React.JSX.Element {

  return (
    <Box>

      <Grid container spacing={4}>

      {badges.map((badge) => (
        <Grid key={badge.id} lg={3} md={4} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea href='#' sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              {/*<CardHeader title={badge.name}/>*/}
              <CardMedia
                component="img"
                alt={badge.image.name}
                image={`/assets/${badge.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, backgroundColor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {badge.name}
                </Typography>
                <Typography variant="body2" mt={2} mb={2}>
                  {badge.description}
                </Typography>

                <Typography variant="overline" color="text.secondary">Condition</Typography>
                <Stack component="ul" spacing={1} style={{listStyleType: 'none', paddingLeft: 0}}>
                  {badge.condition.split(',').map((condition, index) => (
                    <li key={index} style={{display: 'flex', alignItems: 'center', }}>
                      <CheckCircleIcon size={22} style={{marginRight: '8px'}} color="#66bb6a"/>
                      <Typography variant="body2">{condition.trim()}</Typography>
                    </li>
                  ))}
                </Stack>
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
