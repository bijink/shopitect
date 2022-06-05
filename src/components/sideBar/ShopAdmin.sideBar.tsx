import {
   Box,
   Drawer,
   Toolbar,
   List,
   Divider,
   ListItem,
   ListItemText,
   SwipeableDrawer,
   ListItemButton,
   ListItemIcon,
   capitalize,
   IconButton,
   Stack,
   styled,
   Typography
} from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { selectPageId } from '../../redux/slices/pageId.slice';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


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
   const dispatch = useAppDispatch();
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
            <Stack direction="row" width="100%" justifyContent="space-between" alignItems="center" >
               <Typography variant='h6' component="p" >Category</Typography>
               <IconButton onClick={() => setCategoryOpen(false)} >
                  <ArrowBackIosNewIcon />
               </IconButton>
            </Stack>
         </DrawerHeader>
         <Box
            sx={{ width: drawerWidth }}
            role="presentation"
         >
            <List>
               {categoryList && categoryList.map((text, index) => (
                  <ListItem key={index} button disablePadding sx={{ backgroundColor: ((text === 'all') && ((category === 'all') || (!category))) ? '#bdbdbd' : ((category === text) ? '#bdbdbd' : 'transparent') }} onClick={() => {
                     if (text === 'all') {
                        router.push((pageId === 'shopHome_page') ? `/${shopAppId}` : `/${shopAppId}/dashboard`);
                        // dispatch(setProdSearchInput(''));
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
