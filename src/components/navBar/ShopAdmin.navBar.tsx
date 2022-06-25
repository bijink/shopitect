import * as React from 'react';
import {
   Box,
   IconButton,
   Toolbar,
   Typography,
   InputBase,
   MenuItem,
   Menu,
   Tooltip,
   AppBar,
   Avatar,
   Stack,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { auth } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOut as signOutProvider, useSession } from 'next-auth/react';
import { signOut as signOutAccount } from 'firebase/auth';
import { useShop } from '../../hooks';
import { selectPageId } from '../../redux/slices/pageId.slice';
import { setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


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

export default function ShopAdmin_navBar() {
   const router = useRouter();
   const { shopAppUrl, category, productPages } = router.query;

   const dispatch = useAppDispatch();
   const pageId = useAppSelector(selectPageId);

   const { data: shop } = useShop(shopAppUrl);
   // console.log(shop.logoUrl);

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [searchInput, setSearchInput] = React.useState('');


   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };


   const isMenuOpen = Boolean(anchorEl);
   const menuId = 'primary-search-account-menu';
   const renderMenu = (
      <Menu
         id={menuId}
         anchorEl={anchorEl}
         keepMounted
         anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
         transformOrigin={{ vertical: 'top', horizontal: 'right', }}
         open={isMenuOpen}
         onClose={handleMenuClose}
      >
         {!(pageId === 'settings_page') && (
            <MenuItem onClick={() => {
               handleMenuClose();
               router.push(`/${shopAppUrl}/settings`);
            }}>
               <SettingsOutlinedIcon />
               <Typography pl={1} >Settings</Typography>
            </MenuItem>
         )}
         <MenuItem onClick={() => {
            router.push(`/${shopAppUrl}`).then(() => {
               signOutProvider({ redirect: false }).then(() => {
                  signOutAccount(auth);
               });
            });
            handleMenuClose();
         }}>
            <LogoutOutlinedIcon />
            <Typography pl={1} >Log out</Typography>
         </MenuItem>
      </Menu>
   );


   return (
      <>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               <Stack direction="row" alignItems="center" spacing={1.5} pr={3} >
                  <Tooltip title="Back" arrow >
                     <IconButton
                        size="small"
                        color="inherit"
                        onClick={() => router.back()}
                     >
                        <ArrowBackIosNewIcon />
                     </IconButton>
                  </Tooltip>
                  <Tooltip title={shop ? shop.name : ''} arrow >
                     <Avatar alt={shop?.name} src={shop ? shop.logoUrl : ''} />
                  </Tooltip>
                  <Typography
                     variant="h6"
                     noWrap
                     component="h1"
                     sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                     onClick={() => (pageId !== 'shopHome_page') && router.push(`/${shopAppUrl}`)}
                  >
                     {shop?.name}
                  </Typography>
               </Stack>
               <Box sx={{ flexGrow: 10 }} />
               {((pageId === 'shopHome_page') || (productPages === 'table')) && (
                  <Search sx={{ flexGrow: 2 }}>
                     <SearchIconWrapper>
                        <SearchIcon />
                     </SearchIconWrapper>
                     <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        dispatch(setProdSearchInput(searchInput));
                     }} >
                        <StyledInputBase
                           placeholder="Search by product name..."
                           inputProps={{ 'aria-label': 'search' }}
                           value={category ? '' : searchInput}
                           onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setSearchInput(e.target.value);
                           }}
                           onFocus={() => {
                              category && router.push(`/${shopAppUrl}${(productPages === 'table') ? '/product/table' : ''}`);
                              setSearchInput('');
                              dispatch(setProdSearchInput(''));
                           }}
                        />
                     </form>
                  </Search>
               )}
               <Stack
                  direction="row" justifyContent="center" alignItems="center"
                  spacing={1}
               >
                  <Tooltip title="More" arrow >
                     <IconButton
                        size="small"
                        aria-label="show more"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                     >
                        <MoreVertIcon />
                     </IconButton>
                  </Tooltip>
               </Stack>
            </Toolbar>
         </AppBar>
         {renderMenu}
      </>
   );
};
