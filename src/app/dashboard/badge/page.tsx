"use client"
import * as React from 'react';



export default function Page(): React.JSX.Element {


  return (
    <div>
    </div>
    // <Stack spacing={3}>
    //   <Stack direction="row" spacing={3}>
    //     <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
    //       <Typography variant="h4">My Badges</Typography>
    //
    //     </Stack>
    //     <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
    //       <Button startIcon={<MedalIcon fontSize="var(--icon-fontSize-md)"  />} variant="contained">
    //         Browse Badge Catalogue
    //       </Button>
    //     </Stack>
    //
    //     {/*<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>*/}
    //     {/*  <Button startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"  />} variant="contained">*/}
    //     {/*    Import*/}
    //     {/*  </Button>*/}
    //     {/*  <Button startIcon={showForm ? <XCircleIcon fontSize="var(--icon-fontSize-md)" /> : <PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={toggleForm}>*/}
    //     {/*    {showForm ? 'Close' : 'Create'}*/}
    //     {/*  </Button>*/}
    //     {/*</Stack>*/}
    //   </Stack>
    //
    //
    //   <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
    //     <TabContext value={value}>
    //       <Box >
    //         <TabList onChange={handleChange} aria-label="lab API tabs example" >
    //           <Tab label="From Courses" value="1" sx={{px:2}}/>
    //           <Tab label="From Quests" value="2" sx={{px:2}}/>
    //         </TabList>
    //       </Box>
    //       <TabPanel value="1">
    //         { courseBadges.length > 0 ?
    //         <CourseBadgeCard courseBadges={courseBadges}/>
    //         :
    //           <Box>
    //             <Typography variant="body2">No badges earned from any courses yet.</Typography>
    //             <Button
    //               endIcon={<CaretRightIcon/>}
    //               component={RouterLink}
    //               href={paths.dashboard.course}
    //               sx={{mt:2}}
    //               variant="outlined">Browse Courses</Button>
    //           </Box>
    //         }
    //       </TabPanel>
    //       <TabPanel value="2">
    //         { questBadges.length > 0 ?
    //           <QuestBadgeCard questBadges={questBadges}/>
    //           :
    //           <Box>
    //             <Typography variant="body2">No badges earned from any quests yet.</Typography>
    //             <Button
    //               endIcon={<CaretRightIcon/>}
    //               component={RouterLink}
    //               href={paths.dashboard.quest}
    //               sx={{mt:2}}
    //               variant="outlined">Browse Quests</Button>
    //           </Box>
    //         }
    //       </TabPanel>
    //     </TabContext>
    //     <BadgeCard badges={badges}/>
    //   </Stack>
    // </Stack>

  );
}
