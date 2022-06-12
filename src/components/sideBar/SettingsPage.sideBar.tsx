import {
   Box,
   Drawer,
   Toolbar,
   List,
   Divider,
   ListItem,
   ListItemIcon,
   ListItemText,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/router';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';


const drawerWidth = 240;

export default function SettingsPage_sideBar() {
   const router = useRouter();
   const { shopAppUrl } = router.query;

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
            <Box sx={{ overflow: 'auto', '& > *': { padding: 0, margin: 0 } }}>
               <List>
                  <ListItem button onClick={() => router.push(`/${shopAppUrl}`)} >
                     <ListItemIcon>
                        <HomeIcon />
                     </ListItemIcon>
                     <ListItemText primary={'Home'} />
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={() => router.push(`/${shopAppUrl}/settings/profile`)} >
                     <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                     <ListItemText primary='Profile' />
                  </ListItem>
                  <ListItem button onClick={() => router.push(`/${shopAppUrl}/settings/account`)} >
                     <ListItemIcon><SettingsIcon /></ListItemIcon>
                     <ListItemText primary='Account' />
                  </ListItem>
               </List>
            </Box>
         </Drawer>
      </>
   );
}
