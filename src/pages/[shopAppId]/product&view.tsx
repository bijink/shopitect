// *Product View Page
import { Box } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import PublicSection_layout from "../../layouts/Public.layout";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useEffect, useState } from "react";
import { collection, DocumentData, DocumentSnapshot, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../../redux/slices/shopDetails.slice";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import Public_layout from "../../layouts/Public.layout";
import ShopAdmin_layout from "../../layouts/ShopAdmin.layout";
import useSecurePage from "../../hooks/useSecurePage";
import PageNotFound from "../../components/pageNotFound";
import PageLoading_layout from "../../layouts/PageLoading.layout";


const Product: NextPage = () => {
   const router = useRouter();
   const { id: productId, shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);


   // const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   // const [prodDetails, setProdDetails] = useState({} as  DocumentSnapshot<DocumentData>);
   const [prodDetails, setProdDetails] = useState<any>({});

   const secure = useSecurePage(shopAppId);
   // console.log(secure);



   useEffect(() => {
      if (productId && shopDetails.data) {
         getDoc(doc(database, 'shops', shopDetails.data.urlName, 'products', productId.toString())).then((snap) => {
            // console.log(snap.data());
            setProdDetails(snap.data());
         });
      }
   }, [productId, shopDetails]);

   useEffect(() => {
      dispatch(setAppPageId('productView_page'));
   }, []);


   return (
      <>
         <Head>
            {/* <title>{shopDetails?.name ? shopDetails?.name : '·'}</title> */}
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
                           // image='https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'
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
                           // image='https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'
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
            <PageNotFound />
         ))}
      </>
   );
};

export default Product;
