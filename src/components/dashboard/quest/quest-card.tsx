import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import type { Quest } from '@/types/quest';
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import {CardMedia} from "@mui/material";
import RouterLink from "next/link";
import Button from "@mui/material/Button";
import {Trash as TrashIcon} from "@phosphor-icons/react/dist/ssr/Trash";
import CardActions from "@mui/material/CardActions";
import apiService from "@/api/api-service";
import {AxiosError} from "axios";
import {logger} from "@/lib/default-logger";
import {authClient} from "@/lib/auth/client";

interface QuestCardProps {
  rows?: Quest[];
  onQuestDeleteSuccess: () => void;
}

export function QuestCard({ rows = [], onQuestDeleteSuccess }: QuestCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;
  // Calculate the number of pages
  const pageCount = Math.ceil(rows.length / rowsPerPage);
  // Calculate the items to be displayed on the current page
  const currentQuests = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const handleDelete = (questId:number) => async () => {
    try {
      const response = await apiService.delete(`/api/Quest/${questId.toString()}`);
      if (response.status === 204) {
        logger.debug('Deleted successfully');
        onQuestDeleteSuccess();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      <Grid container spacing={4}>

      {currentQuests.map((quest) => (
        <Grid key={quest.id} lg={4} md={6} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} href={`/dashboard/quest/${quest.id.toString()}`} component={RouterLink}>
            <CardHeader title={quest.name} subheader={`${quest.from_course.code} ${quest.from_course.name}`}/>
              <CardMedia
                component="img"
                alt="Multiple Choice"
                image={`/assets/${quest.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
              />
              <CardContent>

                <Chip variant="outlined" label={quest.type} sx={{ mb: 1.5, mr: 1 }} color={
                  quest.type === 'Eduquest MCQ' ? 'primary' :
                    quest.type === 'Wooclap' ? 'neon' :
                      quest.type === 'Kahoot!' ? 'violet' :
                        quest.type === 'Private' ? 'secondary' : 'default'
                } size="small"/>

                <Chip variant="outlined" label={quest.status} sx={{ mb: 1.5 }} color={
                  quest.status === 'Draft' ? 'default' :
                    quest.status === 'Active' ? 'success' :
                      quest.status === 'Expired' ? 'secondary' : 'default'
                } size="small"/>

                {quest.type !=='Private' && (
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    AY{quest.from_course.term.academic_year.start_year}-{quest.from_course.term.academic_year.end_year} {quest.from_course.term.name}
                  </Typography>
                )}

                <Typography variant="body2">
                  {quest.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            {quest.type ==='Private' && (
              <CardActions sx={{ justifyContent: 'flex-end'}}>
                <Button
                  startIcon={<TrashIcon />}
                  color="error"
                  onClick={handleDelete(quest.id)}>
                  Delete
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}


    </Grid>

    </Box>
  );
}
