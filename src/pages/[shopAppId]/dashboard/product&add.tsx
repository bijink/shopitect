// *Product-add Page
import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import ProductInputForm from "../../../components/productInputForm";
import ShopAdminSection_layout from "../../../layouts/ShopAdmin.layout";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../../../redux/slices/shopDetails.slice";
import useSecurePage from "../../../hooks/useSecurePage";
import useHasAdmin from "../../../hooks/useHasAdmin";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import ShopAdmin_layout from "../../../layouts/ShopAdmin.layout";


const Product_add = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   // const hasAdmin = useHasAdmin(shopAppId);
   const secure = useSecurePage(shopAppId);


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('productAdd_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{`Product (add) · ${shopDetails?.name ? shopDetails?.name : '·'}`}</title>
         </Head>

         {/* {hasAdmin && ( */}
         {(secure === "safe") && (
            <ShopAdmin_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                     <Typography variant="h4" component='div' >Add Product Details</Typography>
                  </Stack>
                  <ProductInputForm />
               </>
            </ShopAdmin_layout>
         )}
      </>
   );
};

export default Product_add;
