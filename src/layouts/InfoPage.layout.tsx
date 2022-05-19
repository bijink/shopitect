import type { InfoPageLayoutTypes } from './layout.types';

import { Box, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { Public_sideBar } from '../components/sideBar';
import { Public_navBar } from '../components/navBar';


const InfoPage_layout = ({ children }: InfoPageLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><Public_navBar /></Box>
            <Box component='aside' ><Public_sideBar /></Box>
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

export default InfoPage_layout;