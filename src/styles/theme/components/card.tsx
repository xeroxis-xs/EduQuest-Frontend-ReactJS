import {alpha, type Components} from '@mui/material/styles';
import {nevada} from '../colors';


import type { Theme } from '../types';

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        // padding: 16,
        // gap: 16,
        transition: 'all 100ms ease',
        // backgroundColor: nevada[50],
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        ...theme.applyStyles('dark', {
          backgroundColor: nevada[800],
        }),
        variants: [
          {
            props: {
              variant: 'outlined',
            },
            style: {
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
              background: 'hsl(0, 0%, 100%)',
              ...theme.applyStyles('dark', {
                background: alpha(nevada[900], 0.4),
              }),
            },
          },
        ],
      };
    },
  },
} satisfies Components<Theme>['MuiCard'];
