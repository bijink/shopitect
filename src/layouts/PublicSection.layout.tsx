import {
   Box,
   Toolbar,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import SideMenu from '../components/sideMenu/SideMenu';

import type { LayoutTypes } from './layout.types';


const PublicSection_layout = ({ children }: LayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><NavBar /></Box>
            <Box component='aside' ><SideMenu /></Box>
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

export default PublicSection_layout;
