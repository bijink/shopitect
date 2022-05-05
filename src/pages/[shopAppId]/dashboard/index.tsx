import { Button, Stack, Typography } from '@mui/material';
import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable/ProductTable';
import { database } from '../../../config/firebase.config';
import ShopAdminSection_layout from '../../../layouts/ShopAdminSection.layout';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectShopDetails, setAppShopDetails } from '../../../redux/slices/shopDetails.slice';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   // const [shopDetails, setShopDetails] = useState<DocumentData>([]);


   useEffect(() => {
      shopAppId &&
         onSnapshot(query(collection(database, 'shops'), where('shopUrlName', '==', shopAppId)), (snapshot) => {
            snapshot.forEach(obj => {
               // setShopDetails(obj.data());
               dispatch(setAppShopDetails(obj.data()));
            });
         });
   }, [shopAppId]);


   return (
      <>
         <Head>
            {/* <title>Dashboard · shopName</title> */}
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
