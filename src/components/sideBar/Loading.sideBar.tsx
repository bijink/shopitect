import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { Skeleton } from '@mui/material';


const drawerWidth = 240;

export default function Loading_sideBar() {
   return (
      <>
         <Drawer
            variant="permanent"
            sx={{
               width: drawerWidth,
               flexShrink: 0,
               [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
         >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
               {[1, 2, 3].map((_, index) => (
                  <List key={index} >
                     <ListItem >
                        <Skeleton variant='circular' width={30} height={30} sx={{ marginRight: 3 }} />
                        <Skeleton width={120} height={30} />
                     </ListItem>
                  </List>
               ))}
               <Divider />
               {[1, 2].map((_, index) => (
                  <List key={index} >
                     <ListItem >
                        <Skeleton variant='circular' width={30} height={30} sx={{ marginRight: 3 }} />
                        <Skeleton width={120} height={30} />
                     </ListItem>
                  </List>
               ))}
            </Box>
         </Drawer>
      </>
   );
}
