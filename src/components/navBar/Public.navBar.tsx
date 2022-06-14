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
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { selectPageId } from '../../redux/slices/pageId.slice';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { ChangeEvent, FormEvent, useState } from 'react';



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
   const shop = useAppSelector(selectShopDetails);
   const pageId = useAppSelector(selectPageId);

   const [searchInput, setSearchInput] = useState('');


   return (
      <>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               <Stack direction="row" alignItems="center" spacing={1.5} pr={3} >
                  <Tooltip title={shop?.data?.name} arrow >
                     {/* <Avatar alt={shop?.data?.name} src={} /> */}
                     <Avatar alt={shop?.data?.name} >{shop?.data?.name.slice(0, 1)}</Avatar>
                  </Tooltip>
                  <Typography
                     variant="h6"
                     noWrap
                     component="h1"
                     sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                     onClick={() => router.push(`/${shopAppUrl}`)}
                  >
                     {shop?.data?.name}
                  </Typography>
               </Stack>
               <Box sx={{ flexGrow: 10 }} />
               {(pageId === 'shopHome_page') && (
                  <Search sx={{ flexGrow: 2 }}>
                     <SearchIconWrapper>
                        <SearchIcon />
                     </SearchIconWrapper>
                     <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        dispatch(setProdSearchInput(searchInput));
                     }} >
                        <StyledInputBase
                           placeholder="Search…"
                           inputProps={{ 'aria-label': 'search' }}
                           value={category ? '' : searchInput}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => {
                              setSearchInput(e.target.value);
                           }}
                           onFocus={() => {
                              router.push(`/${shopAppUrl}`);
                              setSearchInput('');
                              dispatch(setProdSearchInput(''));
                           }}
                        />
                     </form>
                  </Search>
               )}
               {(pageId !== `info_page`) && (
                  <Tooltip title="App Information" arrow >
                     <IconButton
                        size="small"
                        aria-label="information about the shop"
                        color="inherit"
                        onClick={() => {
                           router.push(`/${shopAppUrl}/info/about`);
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
