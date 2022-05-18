import type { AccountPageLayoutTypes } from './layout.types';

import { Box, Stack, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { AccountPage_sideBar } from '../components/sideBar';
import { AccountPage_navBar } from '../components/navBar';


const SettingsPage_layout = ({ children }: AccountPageLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><AccountPage_navBar /></Box>
            <Box component='aside' ><AccountPage_sideBar /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box minHeight={'80.5vh'} p={3}>
                  {children}
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default SettingsPage_layout;
