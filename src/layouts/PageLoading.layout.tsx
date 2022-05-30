import { Box, CircularProgress, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../components/footer';
import { Loading_navBar } from '../components/navBar';
import { Loading_sideBar } from '../components/sideBar';


const PageLoading_layout = () => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><Loading_navBar /></Box>
            <Box component='aside' ><Loading_sideBar /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box minHeight='80.5vh' p={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default PageLoading_layout;
