// *Product-add Page
import { Stack, Typography } from "@mui/material";
import ProductInputForm from "../../components/productInputForm";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectShopDetails } from "../../redux/slices/shopDetails.slice";
import { useSecurePage } from "../../hooks";
import { signIn as signInProvider } from "next-auth/react";
import Snackbars from "../../components/snackbars";
import { setAppPageId } from "../../redux/slices/pageId.slice";


const ProductAdd_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const shop = useAppSelector(selectShopDetails);

   const dispatch = useAppDispatch();

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);


   useEffect(() => {
      (secure === 401) && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('productAdd_page'));
   }, []);


   return (
      <>
         <Stack direction='row' pb={2} >
            <Typography variant="h5" component='p' >Add Product Details</Typography>
         </Stack>
         <ProductInputForm shopData={shop?.data && shop.data} />
         {<Snackbars />}
      </>
   );
};

export default ProductAdd_page;
