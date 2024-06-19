import AppBar from '@mui/material/AppBar';
import {
   Box,
   IconButton,
   Toolbar,
   Typography,
   InputBase,
   Tooltip,
   Stack,
   Avatar,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectPageId } from '../../redux/slices/pageId.slice';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { selectProdSearchInput, setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useShop } from '../../hooks';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import secretAccess from '../../utility/secretAccess';
import LockOpenIcon from '@mui/icons-material/LockOpen';


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
   const { shopAppUrl, category } = router.query;
   const dispatch = useAppDispatch();
   const pageId = useAppSelector(selectPageId);
   const searchInput = useAppSelector(selectProdSearchInput);
   const { data: shop } = useShop(shopAppUrl);

   let secretAccess_storage = JSON.parse(sessionStorage.getItem('secret-access')!);

   const handleSecretAccess = () => {
      let isSecretAccess = secretAccess();
      isSecretAccess && router.reload();
   }

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
                     <Box sx={{
                        borderRadius: '50%',
                        border: '1px solid grey',
                     }} >
                        <Avatar alt={shop?.name} src={shop ? shop.logoUrl : ''} />
                     </Box>
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
               {((shopAppUrl === 'my-shop') && secretAccess_storage && !secretAccess_storage?.boolean) ? 
                  (<Tooltip title="Secret Access" arrow >
                     <IconButton
                        size="small"
                        aria-label="secret-access"
                        color="inherit"
                        onClick={handleSecretAccess}
                     >
                        <LockOpenIcon /> 
                     </IconButton>
                  </Tooltip>
                  ) : null
               }
               {(pageId === 'shopHome_page') && (
                  <Search sx={{ flexGrow: 2 }}>
                     <SearchIconWrapper>
                        <SearchIcon />
                     </SearchIconWrapper>
                     <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        // dispatch(setProdSearchInput(searchInput));
                     }} >
                        <StyledInputBase
                           placeholder="Search by product name..."
                           inputProps={{ 'aria-label': 'search' }}
                           value={category ? '' : searchInput}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => {
                              // setSearchInput(e.target.value);
                              dispatch(setProdSearchInput(e.target.value));
                           }}
                           onFocus={() => {
                              category && router.push(`/${shopAppUrl}`);
                              // setSearchInput('');
                              // dispatch(setProdSearchInput(''));
                           }}
                        />
                     </form>
                  </Search>
               )}
               {(pageId !== `about_page`) && (
                  <Tooltip title="About" arrow >
                     <IconButton
                        size="small"
                        aria-label="about the shop"
                        color="inherit"
                        onClick={() => {
                           router.push(`/${shopAppUrl}/about`);
                        }}
                     >
                        <InfoIcon />
                     </IconButton>
                  </Tooltip>
               )}
            </Toolbar>
         </AppBar>
      </>
   );
};
