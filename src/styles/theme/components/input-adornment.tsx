import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiInputAdornment = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.grey[500],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[400],
      }),
    }),
  },
} satisfies Components<Theme>['MuiInputAdornment'];
