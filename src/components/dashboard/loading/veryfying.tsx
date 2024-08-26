import * as React from 'react';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";


export function Verifying(): React.JSX.Element | null {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{mr:2}}/>
      <Typography variant="h6" textAlign="center">
        Verifying...
      </Typography>
    </Box>
);
}
