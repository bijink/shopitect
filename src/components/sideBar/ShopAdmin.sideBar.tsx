import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListItemButton from '@mui/material/ListItemButton';
import { capitalize, styled, Typography } from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { selectPageId } from '../../redux/slices/pageId.slice';


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   padding: theme.spacing(0, 2),
   // necessary for content to be below app bar
   // ...theme.mixins.toolbar,
   justifyContent: 'flex-start',
   paddingTop: '.5rem',
}));


export default function ShopAdmin_sideBar() {
   const router = useRouter();
   const { shopAppId, category } = router.query;
   const shop = useAppSelector(selectShopDetails);
   const pageId = useAppSelector(selectPageId);

   const [categoryOpen, setCategoryOpen] = useState(false);
   const [categoryList, setCategoryList] = useState([] as Array<string>);


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('category')), (snapshot) => {
         let list: Array<string> = [];

         snapshot.forEach(obj => {
            // console.log(obj.data().category);
            list.push(obj.data().category.toLowerCase());
         });

         // let uniqueList = [...new Set(list)];
         let uniqueList = Array.from(new Set(list));
         let sortList = uniqueList.sort();
         sortList.unshift('all');

         setCategoryList(sortList);
      });
   }, [database, shop]);


   const SwipeableTemporaryDrawer = (
      <SwipeableDrawer
         anchor={'left'}
         open={categoryOpen}
         onClose={() => setCategoryOpen(false)}
         onOpen={() => setCategoryOpen(true)}
      >
         <Toolbar />
         <DrawerHeader>
            <Typography variant='h6' component="p" >Category</Typography>
         </DrawerHeader>
         <Box
            sx={{ width: drawerWidth }}
            role="presentation"
            onClick={() => setCategoryOpen(false)}
         // onKeyDown={() => setCategoryOpen(false)}
         >
            <List>
               {categoryList && categoryList.map((text, index) => (
                  // <ListItem key={index} button disablePadding sx={{ backgroundColor: (category === text) ? 'gray' : 'transparent' }} onClick={() => {
                  <ListItem key={index} button disablePadding sx={{ backgroundColor: ((text === 'all') && ((category === 'all') || (!category))) ? 'gray' : ((category === text) ? 'gray' : 'transparent') }} onClick={() => {
                     if (text === 'all') {
                        (category === 'all')
                           // ? router.push(`/${(pageId === 'shopHome_page') ? shopAppId : `${shopAppId}/dashboard`}`)
                           ? router.push((pageId === 'shopHome_page') ? `/${shopAppId}` : `/${shopAppId}/dashboard`)
                           : router.push({
                              pathname: (pageId === 'shopHome_page') ? `/${shopAppId}` : `/${shopAppId}/dashboard`,
                              query: { category: 'all' },
                           });
                     } else {
                        router.push({
                           pathname: (pageId === 'shopHome_page') ? `/${shopAppId}` : `/${shopAppId}/dashboard`,
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
         <Drawer
            variant="permanent"
            // variant="temporary"
            sx={{
               width: drawerWidth,
               flexShrink: 0,
               [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
         >
            <Toolbar />
            <Box sx={{ overflow: 'auto', '& > *': { padding: 0 } }}>
               <List>
                  <ListItem button onClick={() => setCategoryOpen(true)} >
                     <ListItemIcon>
                        <FilterListIcon />
                     </ListItemIcon>
                     <ListItemText primary={'Category'} />
                  </ListItem>
               </List>
            </Box>
         </Drawer>
         {SwipeableTemporaryDrawer}
      </>
   );
}
