// *Product-add Page
import type { NextPage } from "next";

import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import ProductInputForm from "../../../components/productInputForm";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import useSecurePage from "../../../hooks/useSecurePage";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import ShopAdmin_layout from "../../../layouts/ShopAdmin.layout";
import PageLoading_layout from "../../../layouts/PageLoading.layout";
import { signIn as signInProvider } from "next-auth/react";
import Forbidden from "../../403";


const Product_add: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);


   useEffect(() => {
      dispatch(setAppPageId('productAdd_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shop?.data ? `Product (add) · ${shop.data.name}` : 'Loading...'}</title>
         </Head>

         {((secure === "loading") && (
            <PageLoading_layout />
         )) || ((secure === "200") && (
            <ShopAdmin_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                     <Typography variant="h4" component='div' >Add Product Details</Typography>
                  </Stack>
                  <ProductInputForm shopData={shop?.data && shop.data} />
               </>
            </ShopAdmin_layout>
         )) || ((secure === '401') && (
            // signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` })
            <Forbidden />
         )) || ((secure === '403') && (
            <Forbidden />
         ))}
      </>
   );
};

export default Product_add;
