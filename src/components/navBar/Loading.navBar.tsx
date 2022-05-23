import AppBar from '@mui/material/AppBar';
import {
   Box,
   Toolbar,
   InputBase,
   Skeleton,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { selectPageId } from '../../redux/slices/pageId.slice';
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

export default function Loading_navBar() {
   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
            <Toolbar >
               <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 2 }} />
               <Skeleton animation="pulse" width={200} height={45} />
               <Box sx={{ flexGrow: 1 }} />
               <Skeleton variant='circular' width={40} height={40} sx={{ marginRight: 2 }} />
               <Skeleton variant='circular' width={40} height={40} />
            </Toolbar>
         </AppBar>
      </Box>
   );
};
