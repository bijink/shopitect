import { colors } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

const customTheme: ThemeOptions = {
   palette: {
      mode: 'light',
      // mode: 'dark',
      primary: {
         main: colors.teal[800],
      },
      secondary: {
         main: colors.teal[600],
      },
      error: {
         main: colors.red[400],
      },
   },
};

export default customTheme;
