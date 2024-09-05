import type { Components } from '@mui/material/styles';
import {nevada, neonBlue} from '../colors';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import type { Theme } from '../types';
import { alpha } from '@mui/material/styles';

export const MuiOutlinedInput = {
  styleOverrides: {
    input: {
      padding: 0,
    },
    root: ({ theme }) => ({
      padding: '8px 12px',
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.neutral[200]}`,
      backgroundColor: theme.palette.background.level1,
      transition: 'border 120ms ease-in',
      '&:hover': {
        borderColor: nevada[400],
      },
      [`&.${outlinedInputClasses.focused}`]: {
        outline: `1px solid ${alpha(neonBlue[500], 0.5)}`,
        borderColor: neonBlue[500],
      },
      ...theme.applyStyles('dark', {
        '&:hover': {
          borderColor: nevada[700],
        },
      }),
      variants: [
        {
          props: {
            size: 'small',
          },
          style: {
            height: '2.5rem',
          },
        },
        {
          props: {
            size: 'medium',
          },
          style: {
            height: '5.5rem',
          },
        },

      ],
    }),
    notchedOutline: {
      border: 'none',
    },
  },
} satisfies Components<Theme>['MuiOutlinedInput'];
