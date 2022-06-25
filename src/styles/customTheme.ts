import { colors } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

const customTheme: ThemeOptions = {
   palette: {
      mode: 'light',
      // mode: 'dark',
      primary: {
         main: colors.teal[800]
      },
      error: {
         main: '#ef5350'
      },
   },
};

export default customTheme;
