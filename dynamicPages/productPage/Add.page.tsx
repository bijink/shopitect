// *Product-add Page
import { Stack, Typography } from "@mui/material";
import ProductInputForm from "../../components/productInputForm";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppDispatch } from "../../redux/hooks";
import { useShop } from "../../hooks";
import { signIn as signInProvider } from "next-auth/react";
import Snackbars from "../../components/snackbars";
import { setAppPageId } from "../../redux/slices/pageId.slice";


const ProductAdd_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const dispatch = useAppDispatch();

   const { data: shop, secure } = useShop(shopAppUrl);


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
         <ProductInputForm shopData={shop!} />
         {<Snackbars />}
      </>
   );
};

export default ProductAdd_page;
