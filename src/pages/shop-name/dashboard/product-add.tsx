import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import ProductInputForm from "../../../components/productInputForm";
import ShopAdminSection_layout from "../../../layouts/ShopAdminSection.layout";


const Product_add = () => {
   return (
      <>
         <Head>
            <title>Product (add) · shopName</title>
         </Head>

         <ShopAdminSection_layout>
            <>
               <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h4" component='div' >Add Product Details</Typography>
               </Stack>
               <ProductInputForm />
            </>
         </ShopAdminSection_layout>
      </>
   );
};

export default Product_add;
