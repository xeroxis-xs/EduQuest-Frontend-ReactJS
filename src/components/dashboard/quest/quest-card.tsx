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
import {logger} from "@/lib/default-logger";
import {deleteQuest} from "@/api/services/quest";

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
      await deleteQuest(questId.toString());
      onQuestDeleteSuccess();
    } catch (error: unknown) {
      logger.error('Error deleting quest ', error);
    }
  }

  return (
    <Box>

      <Grid container spacing={4} pt={2}>

      {currentQuests.map((quest) => (
        <Grid key={quest.id} lg={4} md={6} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} href={`/dashboard/quest/${quest.id.toString()}`} component={RouterLink}>
            <CardHeader title={quest.name} subheader={`${quest.course_group.name} - ${quest.course_group.course.code} ${quest.course_group.course.name}`}/>
              <CardMedia
                component="img"
                alt="Multiple Choice"
                image={`/assets/${quest.image.filename}`}
                sx={{ margin: 0 }}
              />
              <CardContent>

                <Chip variant="outlined" label={quest.type} sx={{ mb: 1.5, mr: 1 }} color={
                  quest.type === 'Eduquest MCQ' ? 'primary' :
                    quest.type === 'Wooclap' ? 'neon' :
                      quest.type === 'Kahoot!' ? 'violet' :
                        quest.type === 'Private' ? 'secondary' : 'default'
                } size="small"/>

                <Chip variant="outlined" label={quest.status} sx={{ mb: 1.5 }} color={
                    quest.status === 'Active' ? 'success' : 'secondary'
                } size="small"/>

                {quest.tutorial_date ?
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                    Tutorial Date: {new Date(quest.tutorial_date).toLocaleDateString("en-SG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  </Typography> : null
                }

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
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>

    </Box>
  );
}
