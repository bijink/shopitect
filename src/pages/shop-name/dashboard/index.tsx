import { Button, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import ProductTable from '../../../components/productTable/ProductTable';
import ShopAdminSection_layout from '../../../layouts/ShopAdminSection.layout';


const Dashboard: NextPage = () => {
   return (
      <>
         <Head>
            <title>Dashboard · shopName</title>
         </Head>

         <ShopAdminSection_layout>
            <>
               <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h4" component='div' >Product List</Typography>
                  <Button
                     variant='contained'
                     onClick={() => { }}
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
