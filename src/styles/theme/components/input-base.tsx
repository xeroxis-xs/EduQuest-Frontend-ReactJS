import type { Components } from '@mui/material/styles';
import { nevada } from '../colors'
import type { Theme } from '../types';
import { typography } from "../typography";

export const MuiInputBase = {
  styleOverrides: {
    root: {
      border: 'none',
      fontSize: typography.body2.fontSize,
      fontWeight: typography.body2.fontWeight,
      lineHeight: typography.body2.lineHeight,
    },
    input: {
      '&::placeholder': {
        opacity: 0.7,
        color: nevada[500],
      },
    },
  },
} satisfies Components<Theme>['MuiInputBase'];
