import type { PageLayoutProps } from './layout.types';

import * as React from 'react';
import { Box, Stack, Toolbar, Typography, } from '@mui/material';
import Footer from '../components/footer';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppSelector } from '../redux/hooks';
import { selectPageId } from '../redux/slices/pageId.slice';


export const sidebarWidth = '230px';

const Page_layout = ({ children, navbar, sidebar, btmNavbar, title }: PageLayoutProps) => {
   const pageId = useAppSelector(selectPageId);

   return (
      <Box>
         <Box component='header' >{navbar}</Box>
         {sidebar && <Box component='aside' display={{ xs: 'none', sm: 'block' }} >{sidebar}</Box>}
         {btmNavbar && <Box component='div' display={{ xs: 'block', sm: 'none' }} >{btmNavbar}</Box>}
         <Box component="main" minHeight="80vh" pl={{ xs: 0, sm: sidebarWidth }} pb={{ xs: 8, sm: 0 }} >
            <Toolbar />
            {/* {(pageId === 'settings_page') && (
               <Stack spacing={1} direction='row' alignItems="center" px={3} py={1} bgcolor="skyblue" >
                  <Typography variant="h6" component='div' >Settings</Typography>
                  <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
                  <Typography variant="h6" component='div' sx={{ color: '#757575' }} >{title}</Typography>
               </Stack>
            )} */}
            <Box p={2}>{children}</Box>
         </Box>
         <Box component='footer' width="100%" display={{ xs: 'none', sm: 'block' }} pl={sidebarWidth}>
            <Footer />
         </Box>
      </Box>
   );
};

export default Page_layout;
