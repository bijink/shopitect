// *Product-add Page
import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import ProductInputForm from "../../../components/productInputForm";
import ShopAdminSection_layout from "../../../layouts/ShopAdminSection.layout";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../../../redux/slices/shopDetails.slice";
import useSecurePage from "../../../hooks/useSecurePage";


const Product_add = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const isAdmin = useSecurePage(shopAppId);


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   return (
      <>
         <Head>
            <title>{`Product (add) · ${shopDetails?.name ? shopDetails?.name : '·'}`}</title>
         </Head>

         {isAdmin && (
            <ShopAdminSection_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                     <Typography variant="h4" component='div' >Add Product Details</Typography>
                  </Stack>
                  <ProductInputForm />
               </>
            </ShopAdminSection_layout>
         )}
      </>
   );
};

export default Product_add;
