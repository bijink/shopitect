// *Product View Page
import type { NextPage } from "next";
import type { ProductTypes } from "../../types/pages/productView.types";

import Head from "next/head";
import {
   Box,
   Card,
   CardContent,
   CardMedia,
   Typography,
   CardActionArea,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectShopDetails } from "../../redux/slices/shopDetails.slice";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import Public_layout from "../../layouts/Public.layout";
import ShopAdmin_layout from "../../layouts/ShopAdmin.layout";
import useSecurePage from "../../hooks/useSecurePage";
import PageLoading_layout from "../../layouts/PageLoading.layout";
import NotFound from "../404";


const Product: NextPage = () => {
   const router = useRouter();
   const { id: productId, shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [prodDetails, setProdDetails] = useState({} as ProductTypes | DocumentData);
   // console.log(prodDetails);


   useEffect(() => {
      if (productId && shop.data) {
         getDoc(doc(database, 'shops', shop.data.urlName, 'products', productId.toString())).then((snap) => {
            // console.log(snap.data());
            setProdDetails(snap.data()!);
         });
      }
   }, [productId, shop]);

   useEffect(() => {
      dispatch(setAppPageId('productView_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shop?.data ? shop.data.name : 'Loading...'}</title>
            <meta name="description" content="" />
         </Head>

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <ShopAdmin_layout>
               <Box p={1.5} >
                  <Card sx={{ width: '70vw', height: '70vh' }}>
                     <CardActionArea>
                        <CardMedia
                           component="img"
                           height="140"
                           image={prodDetails.imageUrl}
                           alt={prodDetails.name}
                        />
                        <CardContent>
                           <Typography gutterBottom variant="h5" component="div">
                              {prodDetails.name}
                           </Typography>
                           <Typography variant="subtitle1" component="div">
                              {prodDetails.category}
                           </Typography>
                           <Typography variant="h6" component="div">
                              {prodDetails.sellPrice}
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               </Box >
            </ShopAdmin_layout >
         )) || (((secure === '401') || (secure === '403')) && (
            <Public_layout>
               <Box p={1.5} >
                  <Card sx={{ width: '70vw', height: '70vh' }}>
                     <CardActionArea>
                        <CardMedia
                           component="img"
                           height="140"
                           image={prodDetails.imageUrl}
                           alt={prodDetails.name}
                        />
                        <CardContent>
                           <Typography gutterBottom variant="h5" component="div">
                              {prodDetails.name}
                           </Typography>
                           <Typography variant="subtitle1" component="div">
                              {prodDetails.category}
                           </Typography>
                           <Typography variant="h6" component="div">
                              {prodDetails.sellPrice}
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               </Box >
            </Public_layout >
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Product;
