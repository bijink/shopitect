// *Dashboard page
import { Button, Stack, Typography } from '@mui/material';
import { onSnapshot, query } from 'firebase/firestore';
import { NextPage } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable/ProductTable';
import { auth } from '../../../config/firebase.config';
import ShopAdminSection_layout from '../../../layouts/ShopAdminSection.layout';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../../redux/slices/shopDetails.slice';
import useSecurePage from '../../../hooks/useSecurePage';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const user = auth.currentUser;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const isAdmin = useSecurePage(shopAppId);
   // console.log(isAdmin);


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   if (!isAdmin) return (<Head><title>{`${shopDetails?.shopName ? shopDetails?.shopName : "~"}`}</title></Head>);
   else return (
      <>
         <Head>
            <title>{`Dashboard · ${shopDetails?.shopName ? shopDetails?.shopName : '·'}`}</title>
         </Head>

         <ShopAdminSection_layout >
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
         </ShopAdminSection_layout>
      </>
   );
};

export default Dashboard;
