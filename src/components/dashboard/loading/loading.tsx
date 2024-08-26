import * as React from 'react';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export interface LoadingProps {
  text: string;
}

export function Loading( { text } : LoadingProps ): React.JSX.Element | null {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 5, pb: 0 }}>
      <CircularProgress sx={{mr:2}}/>
      <Typography variant="subtitle1" textAlign="center">
        {text}
      </Typography>
    </Box>
);
}
