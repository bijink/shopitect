// *Dashboard page
import type { NextPage } from 'next';

import { Button, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProductTable from '../../../components/productTable/ProductTable';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../../redux/slices/shopDetails.slice';
import useSecurePage from '../../../hooks/useSecurePage';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import ShopAdmin_layout from '../../../layouts/ShopAdmin.layout';
import PageLoading_layout from '../../../layouts/PageLoading.layout';
import { signIn as signInProvider } from "next-auth/react";


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;
   // console.log(shopAppId);

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);


   const secure = useSecurePage(shopAppId);
   // console.log(secure);


   // useEffect(() => {
   //    dispatch(setAppShopDetailsAsync(shopAppId));
   // }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, []);


   return (
      <>
         <Head>
            {/* <title>{`Dashboard · ${shopDetails?.name ? shopDetails?.name : '·'}`}</title> */}
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
                  <ProductTable />
               </>
            </ShopAdmin_layout>
         )) || ((secure === '401') && (
            signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` })
         )) || ((secure === '403') && (
            <Typography>You have no access</Typography>
         ))}
      </>
   );
};

export default Dashboard;
