import type { PublicSectionLayoutTypes } from './layout.types';

import {
   Box,
   Toolbar,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { NavBar } from '../components/navBar';
import { SideBar } from '../components/sideBar';


const PublicSection_layout = ({ children, shopDetails }: PublicSectionLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><NavBar /></Box>
            <Box component='aside' ><SideBar /></Box>
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
