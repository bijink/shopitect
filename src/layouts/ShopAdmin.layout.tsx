import type { ShopAdminLayoutTypes } from './layout.types';

import { Box, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { ShopAdmin_navBar } from '../components/navBar';
import { ShopAdmin_sideBar } from '../components/sideBar';


const ShopAdmin_layout = ({ children }: ShopAdminLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><ShopAdmin_navBar /></Box>
            <Box component='aside' ><ShopAdmin_sideBar /></Box>
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

export default ShopAdmin_layout;
