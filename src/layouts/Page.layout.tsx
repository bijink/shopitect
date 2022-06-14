import type { PageLayoutProps } from './layout.types';

import { Box, Stack, Toolbar, Typography, } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppSelector } from '../redux/hooks';
import { selectPageId } from '../redux/slices/pageId.slice';


const Page_layout = ({ children, navbar, sidebar, title }: PageLayoutProps) => {
   const pageId = useAppSelector(selectPageId);

   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' >{navbar}</Box>
            <Box component='aside' >{sidebar}</Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box minHeight='80.5vh' >
                  {(pageId === 'settings_page') && (
                     <Stack spacing={1} direction='row' alignItems="center" px={3} py={1.5} bgcolor="skyblue" >
                        <Typography variant="h5" component='div' >Settings</Typography>
                        <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
                        <Typography variant="h5" component='div' sx={{ color: '#757575' }}  >{title}</Typography>
                     </Stack>
                  )}
                  <Box p={3} >
                     {children}
                  </Box>
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default Page_layout;
