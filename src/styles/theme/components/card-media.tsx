import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCardMedia = {
  styleOverrides: {
    root: () => ({
      height: 160,
      objectFit: 'contain',
      padding: 32,
      marginTop: 8
    })
  },
} satisfies Components<Theme>['MuiCardMedia'];
