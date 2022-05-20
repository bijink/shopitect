import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/router';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from '@mui/material';


const drawerWidth = 240;

export default function SettingsPage_sideBar() {
   const router = useRouter();
   const { shopAppId } = router.query;

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
               <List>
                  <ListItem button onClick={() => {
                     router.push(`/${shopAppId}/settings/profile`);
                  }} >
                     <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                     <ListItemText primary='Profile' />
                  </ListItem>
               </List>
               <Divider />
               {/* <List>
                  <ListItem button onClick={() => {
                     router.push(`/${shopAppId}/info/admin`);
                  }} >
                     <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                     <ListItemText primary='Admin' sx={{ color: 'GrayText' }} />
                  </ListItem>
               </List> */}
               <List>
                  <ListItem button onClick={() => {
                     router.push(`/${shopAppId}/settings/account`);
                  }} >
                     <ListItemIcon><SettingsIcon /></ListItemIcon>
                     <ListItemText primary='Account' />
                  </ListItem>
               </List>
            </Box>
         </Drawer>
      </>
   );
}
