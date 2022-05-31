import AppBar from '@mui/material/AppBar';
import {
   Box,
   IconButton,
   Toolbar,
   Typography,
   InputBase,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { selectPageId } from '../../redux/slices/pageId.slice';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';



const Search = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginRight: theme.spacing(2),
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
   },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   width: '100%',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      // [theme.breakpoints.up('md')]: {
      //    width: '20ch',
      // },
   },
}));

export default function Public_navBar() {
   const router = useRouter();
   const { shopAppId } = router.query;

   const shopDetails = useAppSelector(selectShopDetails);
   const pageId = useAppSelector(selectPageId);


   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               {(pageId === 'shopHome_page') ? (
                  <IconButton
                     size="small"
                     edge="start"
                     color="inherit"
                     aria-label="open drawer"
                     sx={{ mr: 2 }}
                  // onClick={() => router.push(`/${shopAppId}`)}
                  >
                     <MenuIcon />
                  </IconButton>
               ) : (
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
               )}
               <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                  onClick={() => router.push(`/${shopAppId}`)}
               >
                  {shopDetails?.data?.name}
               </Typography>
               <Box sx={{ flexGrow: 1 }} />
               {(pageId === 'shopHome_page') && (
                  <Search sx={{ flexGrow: 2 }}>
                     <SearchIconWrapper>
                        <SearchIcon />
                     </SearchIconWrapper>
                     <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                     />
                  </Search>
               )}
               <Box sx={{ flexGrow: 1 }} />
               {!((pageId === `about_page`) || (pageId === `admin_page`)) && (
                  <IconButton
                     size="small"
                     aria-label="information about the shop"
                     color="inherit"
                     onClick={() => {
                        // router.push(`/${shopDetails?.data?.urlName}/info/about`);
                        router.push({
                           pathname: `/${shopAppId}/info`,
                           query: { tab: 'about' },
                        });
                     }}
                  >
                     <InfoIcon />
                  </IconButton>
               )}
            </Toolbar>
         </AppBar>
      </Box>
   );
};
