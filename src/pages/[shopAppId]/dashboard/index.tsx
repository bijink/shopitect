// *Dashboard page
import type { NextPage } from 'next';

import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import { PageLoading_layout, ShopAdmin_layout } from '../../../layouts';
import { signIn as signInProvider } from "next-auth/react";
import { selectShopDetails } from '../../../redux/slices/shopDetails.slice';
import Forbidden from '../../403';
import { collection, DocumentData, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../../config/firebase.config';
import NotFound from '../../404';
import { useSecurePage } from '../../../hooks';
import ShopPagesHead from '../../../components/shopPagesHead';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId, category } = router.query;
   // console.log(category);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState(0);

   const [limitNo, setLimitNo] = useState(10);
   // console.log(limitNo);


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products')), (snapshot) => {
         setProdDocLength(snapshot.docs.length);
      });

      if (category) {
         if (category === 'all') {
            (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('codeName')), (snapshot) => {
               setProdDetails(snapshot.docs);
            });
         } else {
            (shop?.data && category) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), where('category', '==', category), orderBy('codeName')), (snapshot) => {
               setProdDetails(snapshot.docs);
            });
         }
      } else {
         // 
         // (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('codeName')), (snapshot) => {
         //    setProdDetails(snapshot.docs);
         // });
         // 

         (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('codeName'), limit(limitNo)), (snapshot) => {
            setProdDetails(snapshot.docs);
         });
      }
   }, [database, shop, category, limitNo]);

   useEffect(() => {
      // (secure === '401') && router.push(`/${shopAppId}`);
      (secure === '401') && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Dashboard" />

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || (((secure === '200') && shop && prodDetails) && (
            <ShopAdmin_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                     <Typography variant="h4" component='div' >Product List</Typography>
                     <Button
                        variant='contained'
                        onClick={() => router.push(`/${shopAppId}/dashboard/product&add`)}
                     >
                        Add
                     </Button>
                  </Stack>
                  {(prodDocLength > 0) ?
                     <>
                        <ProductTable shopData={shop.data} products={prodDetails} />
                        {(limitNo < prodDocLength) && (
                           <Stack direction='row' pt={2} justifyContent="center">
                              <Button
                                 variant='outlined'
                                 size='small'
                                 onClick={() => {
                                    // (limitNo < prodDocLength) && setLimitNo(prev => prev + 10);
                                    setLimitNo(prev => prev + 10);
                                 }}
                              >
                                 <ArrowDropDownIcon />
                              </Button>
                           </Stack>
                        )}
                     </>
                     :
                     <Stack justifyContent="center" alignItems="center" >
                        <Typography variant="h5" component="p" >No Products</Typography>
                     </Stack>
                  }
               </>
            </ShopAdmin_layout>
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Dashboard;
