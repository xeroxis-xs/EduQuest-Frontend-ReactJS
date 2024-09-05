import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';
import { typography } from '../typography';

export const MuiFormLabel = {
  styleOverrides: {
    root: () => ({
      fontSize: typography.overline.fontSize,
      fontWeight: typography.overline.fontWeight,
      lineHeight: typography.overline.lineHeight,
      textTransform: typography.overline.textTransform,
      letterSpacing: typography.overline.letterSpacing,
      marginBottom: 8,
    }),
  },
} satisfies Components<Theme>['MuiFormLabel'];
