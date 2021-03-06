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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { selectPageId } from '../../redux/slices/pageId.slice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import HomeIcon from '@mui/icons-material/Home';
import { sidebarWidth } from '../../layouts/Page.layout';
import { useShop } from '../../hooks';
import { setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';


const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   padding: theme.spacing(0, 2),
   // necessary for content to be below app bar
   // ...theme.mixins.toolbar,
   justifyContent: 'flex-start',
   paddingTop: '.5rem',
}));


export default function Public_sideBar() {
   const router = useRouter();
   const { shopAppUrl, category } = router.query;

   const dispatch = useAppDispatch();
   const pageId = useAppSelector(selectPageId);

   const { data: shop } = useShop(shopAppUrl);

   const [categoryOpen, setCategoryOpen] = useState(false);
   const [categoryList, setCategoryList] = useState([] as Array<string>);


   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('category')), (snapshot) => {
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
   }, [shop]);


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
            sx={{ width: sidebarWidth }}
            role="presentation"
         >
            <List>
               {categoryList && categoryList.map((text, index) => (
                  <ListItem key={index} button disablePadding sx={{ backgroundColor: ((text === 'all') && ((category === 'all') || (!category))) ? '#bdbdbd' : ((category === text) ? '#bdbdbd' : 'transparent') }}
                     onClick={() => {
                        dispatch(setProdSearchInput(''));

                        if (text === 'all') {
                           router.push(`/${shopAppUrl}`);
                        } else {
                           router.push({
                              pathname: `/${shopAppUrl}`,
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
         {/* {((pageId === 'shopHome_page') || (pageId === 'productView_page')) ? ( */}
         <>
            <Drawer
               variant="permanent"
               sx={{
                  width: sidebarWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
               }}
            >
               <Toolbar />
               <Box sx={{ overflow: 'auto' }}>
                  <List sx={{ padding: 0 }} >
                     <ListItem button onClick={() => {
                        router.push(`/${shopAppUrl}`);
                     }} >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary='Home' />
                     </ListItem>
                     {((pageId === 'shopHome_page') && (categoryList.length > 1)) && (
                        <>
                           <Divider />
                           <ListItem button onClick={() => {
                              setCategoryOpen(true);
                           }} >
                              <ListItemIcon><FilterListRoundedIcon /></ListItemIcon>
                              <ListItemText primary='Category' />
                           </ListItem>
                        </>
                     )}
                  </List>
               </Box>
            </Drawer>
            {SwipeableTemporaryDrawer}
         </>
         {/* ) : (
            <Drawer
               variant="permanent"
               sx={{
                  width: sidebarWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
               }}
            >
               <Toolbar />
               <Box sx={{ overflow: 'auto' }}>
                  <List sx={{ padding: 0 }} >
                     <ListItem button onClick={() => {
                        router.push(`/${shopAppUrl}`);
                     }} >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary='Home' />
                     </ListItem>
                     <Divider />
                     <ListItem button onClick={() => {
                        router.push(`/${shopAppUrl}/info/about`);
                     }} >
                        <ListItemIcon><InfoIcon /></ListItemIcon>
                        <ListItemText primary='About' />
                     </ListItem>
                     <ListItem button onClick={() => {
                        router.push(`/${shopAppUrl}/info/admin`);
                     }} >
                        <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                        <ListItemText primary='Admin' sx={{ color: 'GrayText' }} />
                     </ListItem>
                  </List>
               </Box>
            </Drawer>
         )} */}
      </>
   );
}
