import { createTheme } from '@mui/material';

export const pxfTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === 'primary' &&
            ownerState.variant === 'contained') && {
              backgroundColor: '#562ad5',
              '&:hover': {
                backgroundColor: '#562ad5',
                filter: 'brightness(150%)'
              }
          },
          ...(ownerState.color === 'primary' &&
            ownerState.variant === 'outlined') && {
              borderColor: '#562ad5',
              color: '#562ad5',
              '&:hover': {
                borderColor: '#562ad5',
                color: '#562ad5',
                filter: 'brightness(150%)'
              }
          },
        })
      }
    }
  }
});