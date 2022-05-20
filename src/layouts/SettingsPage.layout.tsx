import type { SettingsPageLayoutTypes } from './layout.types';

import { Box, Stack, Toolbar, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { SettingsPage_navBar } from '../components/navBar';
import { SettingsPage_sideBar } from '../components/sideBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const SettingsPage_layout = ({ children, title }: SettingsPageLayoutTypes) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><SettingsPage_navBar /></Box>
            <Box component='aside' ><SettingsPage_sideBar /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               {/* <Box minHeight={'80.5vh'} p={3}> */}
               {/* <Box minHeight={'80.5vh'} > */}
               <Box minHeight={'80.4vh'} >
                  <Stack spacing={1} direction='row' alignItems="center" px={3} py={1.5} bgcolor="cyan" >
                     <Typography variant="h5" component='div' >Settings</Typography>
                     <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
                     <Typography variant="h5" component='div' sx={{ color: '#757575' }} >{title}</Typography>
                  </Stack>
                  <Box px={3} py={1.5} >
                     {children}
                  </Box>
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default SettingsPage_layout;
