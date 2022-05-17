import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import {
   Box,
   Button,
   IconButton,
   Toolbar,
   Typography,
   InputBase,
   Badge,
   MenuItem,
   Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { auth, database } from '../../config/firebase.config';
import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { getSession, signIn as signInProvider, signOut as signOutProvider, useSession } from 'next-auth/react';
import { signOut as signOutAccount } from 'firebase/auth';
import useSecurePage from '../../hooks/useSecurePage';
import InfoIcon from '@mui/icons-material/Info';


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

const NavBar = () => {
   const { data: session } = useSession();

   const router = useRouter();
   const { shopAppId } = router.query;
   // console.log(session?.user);

   const user = auth.currentUser;
   // console.log(user);
   // console.log(user?.photoURL);


   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);
   // console.log(shopDetails.createdAt.toDate());

   const isAdmin = useSecurePage(shopAppId);

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
   // const [shopDetails, setShopDetails] = React.useState<DocumentData>([]);


   const isMenuOpen = Boolean(anchorEl);
   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
   };

   const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setMobileMoreAnchorEl(event.currentTarget);
   };

   const menuId = 'primary-search-account-menu';
   const renderMenu = (
      <Menu
         anchorEl={anchorEl}
         anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
         }}
         id={menuId}
         keepMounted
         transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
         }}
         open={isMenuOpen}
         onClose={handleMenuClose}
      >
         <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
         <MenuItem onClick={handleMenuClose}>My account</MenuItem>
         {session ?
            <MenuItem onClick={(e: any) => {
               e.preventDefault();
               signOutAccount(auth).then(() => {
                  signOutProvider({ redirect: false, callbackUrl: `/${shopDetails.urlName}` });
               });
               handleMenuClose();
            }}>Sign Out</MenuItem>
            :
            <MenuItem onClick={(e: any) => {
               e.preventDefault();
               // signIn('google', undefined, { login_hint: "kbijin528@gmail.com" });
               signInProvider('google');

               handleMenuClose();
            }}>Sign In</MenuItem>
         }
      </Menu>
   );

   const mobileMenuId = 'primary-search-account-menu-mobile';
   const renderMobileMenu = (
      <Menu
         anchorEl={mobileMoreAnchorEl}
         anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
         }}
         id={mobileMenuId}
         keepMounted
         transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
         }}
         open={isMobileMenuOpen}
         onClose={handleMobileMenuClose}
      >
         <MenuItem>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
               <Badge badgeContent={4} color="error">
                  <MailIcon />
               </Badge>
            </IconButton>
            <p>Messages</p>
         </MenuItem>
         <MenuItem>
            <IconButton
               size="large"
               aria-label="show 17 new notifications"
               color="inherit"
            >
               <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
               </Badge>
            </IconButton>
            <p>Notifications</p>
         </MenuItem>
         <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
               size="large"
               aria-label="account of current user"
               aria-controls="primary-search-account-menu"
               aria-haspopup="true"
               color="inherit"
            >
               <AccountCircle />
            </IconButton>
            <p>Profile</p>
         </MenuItem>
      </Menu>
   );


   // React.useEffect(() => {
   //    auth.onAuthStateChanged(shop => {
   //       shop &&
   //          onSnapshot(query(collection(database, 'shops'), where('accountID', '==', shop?.uid)), (snapshot) => {
   //             snapshot.forEach(obj => {
   //                setShopDetails(obj.data());
   //             });
   //          });
   //    });
   // }, []);


   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
               >
                  <MenuIcon />
               </IconButton>
               <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                  onClick={() => router.push(`/${shopDetails?.urlName}`)}
               >
                  {shopDetails?.name}
               </Typography>
               <Box sx={{ flexGrow: 1 }} />
               <Search sx={{ flexGrow: 2 }}>
                  <SearchIconWrapper>
                     <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                     placeholder="Search…"
                     inputProps={{ 'aria-label': 'search' }}
                  />
               </Search>
               <Box sx={{ flexGrow: 1 }} />
               <Box display="flex" justifyContent="center" alignItems="center">
                  {isAdmin ? (
                     <>
                        <Button variant='contained' color='secondary' onClick={() => {
                           router.push(`/${shopDetails?.urlName}/dashboard`);
                        }}>Dash</Button>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                           <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                              <Badge badgeContent={4} color="error">
                                 <MailIcon />
                              </Badge>
                           </IconButton>
                           <IconButton
                              size="large"
                              aria-label="show 17 new notifications"
                              color="inherit"
                           >
                              <Badge badgeContent={17} color="error">
                                 <NotificationsIcon />
                              </Badge>
                           </IconButton>
                           {/* <IconButton
                              size="large"
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleProfileMenuOpen}
                              color="inherit"
                           >
                              <AccountCircle />
                           </IconButton> */}
                           {(user?.photoURL) && (
                              <Button
                                 size="large"
                                 aria-label="account of current user"
                                 aria-controls={menuId}
                                 aria-haspopup="true"
                                 onClick={handleProfileMenuOpen}
                                 color="inherit"
                              >
                                 <img style={{ width: '40px', borderRadius: '50%' }} src={user.photoURL!} alt="" />
                              </Button>
                           )}
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                           <IconButton
                              size="large"
                              aria-label="show more"
                              aria-controls={mobileMenuId}
                              aria-haspopup="true"
                              onClick={handleMobileMenuOpen}
                              color="inherit"
                           >
                              <MoreIcon />
                           </IconButton>
                        </Box>
                     </>
                  ) : (
                     <IconButton
                        size="small"
                        aria-label="information about the shop"
                        color="inherit"
                        onClick={() => {
                           router.push(`/${shopDetails.urlName}/info/about`);
                        }}
                     >
                        <InfoIcon />
                     </IconButton>
                  )}
               </Box>
            </Toolbar>
         </AppBar>
         {renderMobileMenu}
         {renderMenu}
      </Box >
   );
};

export default NavBar;
