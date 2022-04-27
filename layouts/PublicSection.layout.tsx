import {
   Box,
   Toolbar,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import MUi_permenentDrawer from '../components/ui_components/MUi_permenentDrawer';


type LayoutProps = {
   children: ReactNode;
};


const _publicSectionLayout_ = ({ children }: LayoutProps) => {
   return (
      <Box>
         <CssBaseline />
         <Box sx={{ display: 'flex' }}>
            <Box component='header' ><Header /></Box>
            <Box component='aside' ><MUi_permenentDrawer /></Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
               <Toolbar />
               <Box p={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {children}
               </Box>
               <Box component='footer' ><Footer /></Box>
            </Box>
         </Box>
      </Box >
   );
};

export default _publicSectionLayout_;
