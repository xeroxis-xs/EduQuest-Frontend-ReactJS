import * as React from 'react';
import type { Components } from '@mui/material/styles';
import { nevada, neonBlue } from '../colors';
import type { Theme } from '../types';
import { alpha } from '@mui/material/styles';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CircleIcon from '@mui/icons-material/Circle';

export const MuiRadio = {
  defaultProps: {
    disableRipple: true,
    icon: (
      <RadioButtonUncheckedRoundedIcon sx={{ color: 'hsla(210, 0%, 0%, 0.0)' }} />
    ),
    checkedIcon: <CircleIcon sx={{ height: 10, width: 10 }} />,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      margin: 10,
      height: 16,
      width: 16,
      borderRadius: '50%',
      border: '1px solid ',
      borderColor: alpha(nevada[300], 0.8),
      boxShadow: '0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset',
      backgroundColor: alpha(nevada[100], 0.4),
      transition: 'border-color, background-color, 120ms ease-in',
      '&:hover': {
        borderColor: neonBlue[300],
      },
      '&.Mui-focusVisible': {
        outline: `3px solid ${alpha(neonBlue[500], 0.5)}`,
        outlineOffset: '2px',
        borderColor: neonBlue[400],
      },
      '&.Mui-checked': {
        color: 'white',
        backgroundColor: neonBlue[500],
        borderColor: neonBlue[500],
        boxShadow: `none`,
        '&:hover': {
          backgroundColor: neonBlue[600],
        },
      },
      ...theme.applyStyles('dark', {
        borderColor: alpha(nevada[700], 0.8),
        boxShadow: '0 0 0 1.5px hsl(210, 0%, 0%) inset',
        backgroundColor: alpha(nevada[900], 0.8),
        '&:hover': {
          borderColor: neonBlue[300],
        },
        '&.Mui-focusVisible': {
          borderColor: neonBlue[400],
          outline: `3px solid ${alpha(neonBlue[500], 0.5)}`,
          outlineOffset: '2px',
        },
      }),
    }),
  },
} satisfies Components<Theme>['MuiRadio'];
