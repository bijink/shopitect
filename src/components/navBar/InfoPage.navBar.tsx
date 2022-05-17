import AppBar from '@mui/material/AppBar';
import {
   Box,
   IconButton,
   Toolbar,
   Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


export const InfoPage_navBar = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const shopDetails = useAppSelector(selectShopDetails);


   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  onClick={() => router.push(`/${shopAppId}`)}
               >
                  <ArrowBackIosNewIcon />
               </IconButton>
               <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                  onClick={() => router.push(`/${shopAppId}`)}
               >
                  {shopDetails?.name}
               </Typography>
            </Toolbar>
         </AppBar>
      </Box>
   );
};
