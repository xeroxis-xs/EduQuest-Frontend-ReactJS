import type { Components } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import type { Theme } from '../types';
import {typography} from "@/styles/theme/typography";

export const MuiTableHead = {
  styleOverrides: {
    root: {
      [`& .${tableCellClasses.root}`]: {
        backgroundColor: 'var(--mui-palette-background-level2)',
        color: 'var(--mui-palette-text-secondary)',
        lineHeight: 1,
        fontSize: typography.overline.fontSize,
        fontWeight: typography.overline.fontWeight,
        textTransform: typography.overline.textTransform,
        letterSpacing: typography.overline.letterSpacing,
      },
    },
  },
} satisfies Components<Theme>['MuiTableHead'];
