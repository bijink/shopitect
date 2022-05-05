import { Stack, Typography } from "@mui/material";
import Head from "next/head";
import ProductInputForm from "../../../components/productInputForm";
import ShopAdminSection_layout from "../../../layouts/ShopAdminSection.layout";
import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { database } from '../../../config/firebase.config';
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectShopDetails, setAppShopDetails } from "../../../redux/slices/shopDetails.slice";

const Product_add = () => {
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
            <title>{`Product (add) · ${shopDetails?.shopName ? shopDetails?.shopName : '·'}`}</title>
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
