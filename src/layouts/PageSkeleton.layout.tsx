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
   colors,
   Stack,
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
                        <Stack direction="row" alignItems="center" spacing={1.5} >
                           <Skeleton variant='circular' width={30} height={30} />
                           <Skeleton variant='circular' width={40} height={40} />
                           <Skeleton width={200} height={45} />
                        </Stack>
                        <Box sx={{ flexGrow: 1 }} />
                        {/* <Skeleton variant='circular' width={40} height={40} /> */}
                        <Skeleton variant='circular' width={30} height={30} />
                     </Toolbar>
                  </AppBar>
               </Box>
            </Box>
            {/* Sidenav */}
            <Box component='aside' display={{ xs: 'none', sm: 'block' }} >
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
            {/* Bottom Navbar */}
            {/* <Stack
               direction="row"
               justifyContent="space-around"
               alignItems="center"
               width="100%"
               height="3.5rem"
               bgcolor={colors.grey[200]}
               display={{ xs: 'flex', sm: 'none' }}
               sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            >
               <Skeleton variant='circular' width={30} height={30} />
               <Skeleton variant='circular' width={30} height={30} />
               <Skeleton variant='circular' width={30} height={30} />
            </Stack> */}
         </Box>
      </Box>
   );
};

export default PageSkeleton_layout;
