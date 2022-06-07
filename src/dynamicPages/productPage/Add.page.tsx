// *Product-add Page
import { Stack, Typography } from "@mui/material";
import ProductInputForm from "../../components/productInputForm";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAppSelector } from "../../redux/hooks";
import { selectShopDetails } from "../../redux/slices/shopDetails.slice";
import { useSecurePage } from "../../hooks";
import { signIn as signInProvider } from "next-auth/react";


const ProductAdd_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);


   useEffect(() => {
      (secure === '401') && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);


   return (
      <>
         <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" component='div' >Add Product Details</Typography>
         </Stack>
         <ProductInputForm shopData={shop?.data && shop.data} />
      </>
   );
};

export default ProductAdd_page;
