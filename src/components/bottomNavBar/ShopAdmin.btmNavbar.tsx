import {
   Paper,
   BottomNavigation,
   BottomNavigationAction,
   Box,
   Toolbar,
   List,
   ListItem,
   ListItemText,
   SwipeableDrawer,
   ListItemButton,
   capitalize,
   IconButton,
   Stack,
   styled,
   Typography,
   colors,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { selectPageId } from '../../redux/slices/pageId.slice';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { changeProdTableCollapse } from '../../redux/slices/prodTableCollapse.slice';
import { sidebarWidth } from '../../layouts/Page.layout';
import { useShop } from '../../hooks';
import FilterListIcon from '@mui/icons-material/FilterList';


const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   padding: theme.spacing(0, 2),
   // necessary for content to be below app bar
   // ...theme.mixins.toolbar,
   justifyContent: 'flex-start',
   paddingTop: '.5rem',
}));

export default function ShopAdmin_btmNavbar() {
   const router = useRouter();
   const { shopAppUrl, category } = router.query;

   const dispatch = useAppDispatch();
   const pageId = useAppSelector(selectPageId);
   // const btmNavbarTab = useAppSelector(selectBtmNavbarTab);

   const { data: shop } = useShop(shopAppUrl);

   const [categoryOpen, setCategoryOpen] = useState(false);
   const [categoryList, setCategoryList] = useState([] as Array<string>);

   // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
   //    // setValue(newValue);
   //    dispatch(setBtmNavbarTab(newValue));
   // };


   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('category')), (snapshot) => {
         let list: Array<string> = [];

         snapshot.forEach(obj => {
            list.push(obj.data().category.toLowerCase());
         });

         let uniqueList = Array.from(new Set(list));
         let sortList = uniqueList.sort();
         sortList.unshift('all');

         setCategoryList(sortList);
      });
   }, [shop]);


   const SwipeableTemporaryDrawer = (
      <SwipeableDrawer
         anchor={'right'}
         open={categoryOpen}
         onClose={() => setCategoryOpen(false)}
         onOpen={() => setCategoryOpen(true)}
      >
         <Toolbar />
         <DrawerHeader sx={{ paddingLeft: 0 }} >
            <Stack direction="row" spacing={1} width="100%" alignItems="center" >
               <IconButton onClick={() => setCategoryOpen(false)} >
                  <ArrowForwardIosIcon />
               </IconButton>
               <Typography variant='h6' component="p" >Categories</Typography>
            </Stack>
         </DrawerHeader>
         <Box
            sx={{ width: sidebarWidth }}
            role="presentation"
         >
            <List>
               {categoryList && categoryList.map((text, index) => (
                  <ListItem key={index} button disablePadding sx={{ backgroundColor: ((text === 'all') && ((category === 'all') || (!category))) ? '#bdbdbd' : ((category === text) ? '#bdbdbd' : 'transparent') }}
                     onClick={() => {
                        dispatch(changeProdTableCollapse());

                        if (text === 'all') {
                           router.push(((pageId === 'shopHome_page'))
                              ? `/${shopAppUrl}`
                              : `/${shopAppUrl}/product/table`);
                        } else {
                           router.push({
                              pathname: ((pageId === 'shopHome_page'))
                                 ? `/${shopAppUrl}`
                                 : `/${shopAppUrl}/product/table`,
                              query: { category: text },
                           });
                        }
                     }}>
                     <ListItemButton sx={{ paddingTop: 0, paddingBottom: 0 }} >
                        <ListItemText primary={capitalize(text)} />
                     </ListItemButton>
                  </ListItem>
               ))}
            </List>
         </Box>
      </SwipeableDrawer >
   );



   return (
      <>
         <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={5} >
            <BottomNavigation
               value={
                  ((pageId === 'shopHome_page') && 'home') ||
                  ((pageId === 'dashboard_page') && 'dashboard') ||
                  (((pageId === 'productTable_page') || pageId === 'productAdd_page') && 'product')
               }
            // onChange={handleChange}
            >
               <BottomNavigationAction
                  label="Home"
                  value="home"
                  icon={<HomeIcon />}
                  onClick={() => router.push(`/${shopAppUrl}`)}
               />
               <BottomNavigationAction
                  label="Dashboard"
                  value="dashboard"
                  icon={<DashboardIcon />}
                  onClick={() => router.push(`/${shopAppUrl}/dashboard`)}
               />
               <BottomNavigationAction
                  label="Product"
                  value="product"
                  icon={<ShoppingCartIcon />}
                  onClick={() => router.push(`/${shopAppUrl}/product/table`)}
               />
            </BottomNavigation>
         </Paper>

         {(((pageId === 'shopHome_page') || (pageId === 'productTable_page')) && (categoryList.length > 1)) && (
            <IconButton
               size="small"
               onClick={() => setCategoryOpen(true)}
               sx={{
                  position: 'fixed',
                  bottom: '4rem',
                  right: '1.2rem',
                  color: 'white',
                  zIndex: 1,
                  bgcolor: colors.grey[600],
                  '&:hover': { bgcolor: colors.grey[800], }
               }}
            >
               <FilterListIcon />
            </IconButton>
         )}

         {SwipeableTemporaryDrawer}
      </>
   );
}
