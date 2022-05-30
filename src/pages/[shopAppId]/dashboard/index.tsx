// *Dashboard page
import type { NextPage } from 'next';

import { Button, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import { PageLoading_layout, ShopAdmin_layout } from '../../../layouts';
import { signIn as signInProvider } from "next-auth/react";
import { selectShopDetails } from '../../../redux/slices/shopDetails.slice';
import Forbidden from '../../403';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../../config/firebase.config';
import NotFound from '../../404';
import { useSecurePage, useUser } from '../../../hooks';
import ShopPagesHead from '../../../components/shopPagesHead';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   // const { status } = useUser();
   // console.log(status);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState(0);


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('codeName')), (snapshot) => {
         setProdDetails(snapshot.docs);

         // console.log(snapshot.docs.length);
         setProdDocLength(snapshot.docs.length);
      });
   }, [database, shop]);

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
                     <ProductTable shopData={shop.data} products={prodDetails} />
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
