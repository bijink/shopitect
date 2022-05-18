// *Dashboard page
import type { NextPage } from 'next';

import { Button, Stack, Typography } from '@mui/material';
import { onSnapshot, query } from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable/ProductTable';
import { auth } from '../../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../../redux/slices/shopDetails.slice';
import useSecurePage from '../../../hooks/useSecurePage';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import ShopAdmin_layout from '../../../layouts/ShopAdmin.layout';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const user = auth.currentUser;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   // const isAdmin = useSecurePage(shopAppId);
   // console.log(isAdmin);
   const secure = useSecurePage(shopAppId);
   // console.log(secure);


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{`Dashboard · ${shopDetails?.name ? shopDetails?.name : '·'}`}</title>
         </Head>

         {/* {isAdmin && ( */}
         {(secure === 'safe') && (
            <ShopAdmin_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                     <Typography variant="h4" component='div' >Product List</Typography>
                     <Button
                        variant='contained'
                        onClick={() => router.push(`/${shopAppId}/dashboard/product-add`)}
                     >
                        Add
                     </Button>
                  </Stack>
                  <ProductTable />
               </>
            </ShopAdmin_layout>
         )}
      </>
   );
};

export default Dashboard;
