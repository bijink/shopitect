import type { PageLayoutProps } from './layout.types';

import * as React from 'react';
import { Box, Stack, Toolbar, Typography, } from '@mui/material';
import Footer from '../components/footer';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppSelector } from '../redux/hooks';
import { selectPageId } from '../redux/slices/pageId.slice';


export const sidebarWidth = '230px';

const Page_layout = ({ children, navbar, sidebar, title }: PageLayoutProps) => {
   const pageId = useAppSelector(selectPageId);

   return (
      <Box>
         <Box component='header' >{navbar}</Box>
         <Box component='aside' >{sidebar}</Box>
         <Box component="main" minHeight="80vh" pl={sidebarWidth}  >
            <Toolbar />
            {(pageId === 'settings_page') && (
               <Stack spacing={1} direction='row' alignItems="center" px={3} py={1.5} bgcolor="skyblue" >
                  <Typography variant="h5" component='div' >Settings</Typography>
                  <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
                  <Typography variant="h5" component='div' sx={{ color: '#757575' }} >{title}</Typography>
               </Stack>
            )}
            <Box p={2}>{children}</Box>
         </Box>
         <Box component='footer' width="100%" pl={sidebarWidth}>
            <Footer />
         </Box>
      </Box>
   );
};

export default Page_layout;
