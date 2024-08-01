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

interface QuestCardProps {
  rows?: Quest[];
}

export function QuestCard({
                             rows = [],
                           }: QuestCardProps): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;
  // Calculate the number of pages
  const pageCount = Math.ceil(rows.length / rowsPerPage);
  // Calculate the items to be displayed on the current page
  const currentQuests = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // Handle page change
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary" />
      </Box>
      <Grid container spacing={4}>

      {currentQuests.map((quest) => (
        <Grid key={quest.id} lg={4} md={6} xs={12} >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardActionArea sx={{ height: '100%'}} href={`/dashboard/quest/${quest.id.toString()}`} component={RouterLink}>
            <CardHeader title={quest.name} subheader={quest.from_course.name}/>
              <CardMedia
                component="img"
                alt="Multiple Choice"
                image={`/assets/${quest.image.filename}`}
                sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
              />
              <CardContent>

                <Chip variant="outlined" label={quest.type} sx={{ mb: 1.5, mr: 1 }} color={
                  quest.type === 'Eduquest MCQ' ? 'primary' :
                    quest.type === 'Wooclap' ? 'info' :
                      quest.type === 'Kahoot!' ? 'info' :
                        quest.type === 'Other' ? 'default' : 'default'
                } size="small"/>

                <Chip variant="outlined" label={quest.status} sx={{ mb: 1.5 }} color={
                  quest.status === 'Draft' ? 'default' :
                    quest.status === 'Active' ? 'success' :
                      quest.status === 'Expired' ? 'default' : 'default'
                } size="small"/>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  AY{quest.from_course.term.academic_year.start_year}-{quest.from_course.term.academic_year.end_year} {quest.from_course.term.name}
                </Typography>
                <Typography variant="body2">
                  {quest.description}
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
