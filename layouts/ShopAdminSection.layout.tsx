import { Box, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import SideMenu from '../components/sideMenu/SideMenu';

import type { ShopAdminSectionTypes } from './layout.types';


const ShopAdminSection_layout = ({ children }: ShopAdminSectionTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='nav' ><NavBar /></Box>
            <Box component='aside' ><SideMenu /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box p={3}>
                  {children}
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default ShopAdminSection_layout;
