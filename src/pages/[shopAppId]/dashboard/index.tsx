// *Dashboard page
import { Button, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable/ProductTable';
import ShopAdminSection_layout from '../../../layouts/ShopAdminSection.layout';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../../redux/slices/shopDetails.slice';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const [loading, setLoading] = useState(true);


   useEffect(() => {
      const securePage = async () => {
         const session = await getSession();

         if (!session) {
            setLoading(true);
            shopAppId && router.push(`/${shopAppId}`);
         } else {
            setLoading(false);
         }
      };
      securePage();
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   if (loading) return (<Head><title>{`${shopDetails?.shopName ? shopDetails?.shopName : '·'}`}</title></Head>);
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
