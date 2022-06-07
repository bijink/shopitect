import {
   Box,
   CssBaseline,
   CircularProgress,
   Toolbar,
   AppBar,
   Skeleton,
   Drawer,
   List,
   ListItem,
} from '@mui/material';
import Footer from '../components/footer';


const drawerWidth = 240;

const PageSkeleton_layout = () => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' >
               <Box sx={{ flexGrow: 1 }}>
                  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                     <Toolbar >
                        <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 2 }} />
                        <Skeleton animation="pulse" width={200} height={45} />
                        <Box sx={{ flexGrow: 1 }} />
                        <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 2 }} />
                        <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 2 }} />
                     </Toolbar>
                  </AppBar>
               </Box>
            </Box>
            <Box component='aside' >
               <Drawer
                  variant="permanent"
                  sx={{
                     width: drawerWidth,
                     flexShrink: 0,
                     [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                  }}
               >
                  <Toolbar />
                  <Box sx={{ overflow: 'auto', '& > *': { padding: 0 } }}>
                     {[1, 2, 3].map((_, index) => (
                        <List key={index} >
                           <ListItem >
                              <Skeleton variant='circular' width={30} height={30} sx={{ marginRight: 3 }} />
                              <Skeleton width={120} height={30} />
                           </ListItem>
                        </List>
                     ))}
                     {[1].map((_, index) => (
                        <List key={index} >
                           <ListItem >
                              <Skeleton variant='circular' width={30} height={30} sx={{ marginRight: 3 }} />
                              <Skeleton width={120} height={30} />
                           </ListItem>
                        </List>
                     ))}
                  </Box>
               </Drawer>
            </Box>
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

export default PageSkeleton_layout;
