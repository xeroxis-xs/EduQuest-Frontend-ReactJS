import { paperClasses } from '@mui/material/Paper';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '20px',
        [`&.${paperClasses.elevation1}`]: {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 3px 12px 0 rgba(0, 0, 0, 0.08), 0 0 0 0px rgba(255, 255, 255, 0.1)'
              : '0 3px 12px 0 rgba(0, 0, 0, 0.08), 0 0 0 0px rgba(0, 0, 0, 0.05)',
        },
      };
    },
  },
} satisfies Components<Theme>['MuiCard'];
