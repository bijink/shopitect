import type { PublicLayoutTypes } from './layout.types';

import { Box, Toolbar, } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { Public_navBar } from '../components/navBar';
import { Public_sideBar } from '../components/sideBar';


const Public_layout = ({ children }: PublicLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><Public_navBar /></Box>
            <Box component='aside' ><Public_sideBar /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box minHeight='80.5vh' p={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {children}
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default Public_layout;
