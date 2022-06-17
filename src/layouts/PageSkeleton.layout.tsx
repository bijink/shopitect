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
import { ReactNode } from 'react';
import { sidebarWidth } from './Page.layout';


const PageSkeleton_layout = ({ children }: { children?: ReactNode; }) => {
   return (
      <Box>
         <CssBaseline />
         <Box display='flex' >
            {/* Navbar */}
            <Box component='header' >
               <Box sx={{ flexGrow: 1 }}>
                  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                     <Toolbar >
                        <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 1.5 }} />
                        <Skeleton width={200} height={45} />
                        <Box sx={{ flexGrow: 1 }} />
                        <Skeleton variant='circular' width={40} height={40} />
                     </Toolbar>
                  </AppBar>
               </Box>
            </Box>
            {/* Sidenav */}
            <Box component='aside' >
               <Drawer
                  variant="permanent"
                  sx={{
                     width: sidebarWidth,
                     flexShrink: 0,
                     [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
                  }}
               >
                  <Toolbar />
                  <Box sx={{ overflow: 'auto' }}>
                     <List sx={{ padding: 0 }} >
                        {[...Array(3)].map((_, index) => (
                           <ListItem key={index} >
                              <Skeleton variant='circular' width={31} height={31} sx={{ marginRight: 3 }} />
                              <Skeleton width={120} height={30} />
                           </ListItem>
                        ))}
                     </List>
                  </Box>
               </Drawer>
            </Box>
            {/* Main-body */}
            {children ? (
               <Box component="main" flexGrow={1} >
                  <Toolbar />
                  <Box p={2}>{children}</Box>
               </Box>
            ) : (
               <Box component="main" flexGrow={1} >
                  <Toolbar />
                  <Box display="flex" justifyContent="center" p={2} >
                     <CircularProgress />
                  </Box>
               </Box>
            )}
         </Box>
      </Box>
   );
};

export default PageSkeleton_layout;
