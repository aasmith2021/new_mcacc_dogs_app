'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500', // orange
    },
    secondary: {
      main: '#90EE90', // light green
    },
    background: {
      default: '#FFFFFF', // white
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
