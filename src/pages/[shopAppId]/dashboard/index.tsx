// *Dashboard page
import type { NextPage } from 'next';

import { Button, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import useSecurePage from '../../../hooks/useSecurePage';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import ShopAdmin_layout from '../../../layouts/ShopAdmin.layout';
import PageLoading_layout from '../../../layouts/PageLoading.layout';
import { signIn as signInProvider } from "next-auth/react";
import { selectShopDetails } from '../../../redux/slices/shopDetails.slice';
import Forbidden from '../../403';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../../config/firebase.config';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop?.data?.urlName, 'products'), orderBy('codeName')), (snapshot) => {
         setProdDetails(snapshot.docs);
      });
   }, [database, shop]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shop?.data ? `Dashboard · ${shop.data.name}` : 'Loading...'}</title>
         </Head>

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
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
                  <ProductTable shopData={shop?.data} products={prodDetails} />
               </>
            </ShopAdmin_layout>
         )) || ((secure === '401') && (
            signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` })
            // <Forbidden />
         )) || ((secure === '403') && (
            <Forbidden />
         ))}
      </>
   );
};

export default Dashboard;
