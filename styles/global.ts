import { extendTheme } from '@chakra-ui/react';
import { Lexend_Deca } from '@next/font/google';

// This is the global theme for the entire app.
const lexenddeca = Lexend_Deca();

export const global_theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontFamily: lexenddeca.style.fontFamily,
        color: 'accent_white'
      }
    }
  },
  colors: {
    accent_blue: '#182335',
    accent_red: '#EF694D',
    accent_yellow: '#EFCB68',
    accent_yellow_light: '#FFF6E9',
    accent_white: '#e1e1e1'
  }
});
