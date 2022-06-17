import {
   Box,
   Typography,
   Stack,
   CircularProgress,
   capitalize,
   Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectShopDetails } from "../../redux/slices/shopDetails.slice";
import { ProductTypes } from "../../types/pages/productView.types";
import { setAppPageId } from "../../redux/slices/pageId.slice";


const ProductView_page = () => {
   const router = useRouter();
   const { id: productId } = router.query;

   const dispatch = useAppDispatch();

   const shop = useAppSelector(selectShopDetails);

   const [prodDetails, setProdDetails] = useState({} as ProductTypes | DocumentData);
   // console.log(prodDetails && Object.keys(prodDetails).length);


   useEffect(() => {
      if (productId && shop.data) {
         getDoc(doc(database, 'shops', shop.data.urlName, 'products', productId.toString())).then((snap) => {
            setProdDetails(snap.data()!);
         });
      }
   }, [productId, shop]);

   useEffect(() => {
      dispatch(setAppPageId('productView_page'));
   }, []);


   return (
      <>
         {(!productId || !prodDetails) ? (
            <Typography variant="h5" component="p" textAlign="center" >Product Not Found...</Typography>
         ) : (
            ((prodDetails && Object.keys(prodDetails).length < 1) ? (
               <Stack justifyContent="center" alignItems="center" >
                  <CircularProgress />
               </Stack>
            ) : (
               <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  bgcolor="whitesmoke"
                  // divider={<Divider orientation='vertical' flexItem />}
                  // minHeight="75vh"
                  style={{ borderRadius: '5px' }}
               >
                  <Box
                     width="100%"
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                  >
                     <img
                        src={prodDetails.imageUrl}
                        width="100%"
                        style={{ borderRadius: '4px' }}
                     />
                  </Box>

                  <Box
                     width="100%"
                     display="flex"
                     alignItems="center"
                     px={2}
                     py={{ xs: 2, sm: 0 }}
                  >
                     <Stack spacing={{ xs: 0, sm: 1 }} >
                        <Typography variant="h6" component="h3" >
                           Name:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              {capitalize(prodDetails.name)}
                           </Typography>
                        </Typography>
                        <Typography variant="h6" component="p" >
                           Brand:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              {prodDetails.brand}
                           </Typography>
                        </Typography>
                        <Typography variant="h6" component="p" >
                           Category:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              {capitalize(prodDetails.category)}
                           </Typography>
                        </Typography>
                        <Typography variant="h6" component="p" >
                           Quantity:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              {prodDetails.quantity}
                           </Typography>
                        </Typography>
                        <Typography variant="h6" component="p" >
                           Price:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              &#x20B9; {prodDetails.sellPrice}
                           </Typography>
                        </Typography>
                        <Typography variant="h6" component="p" >
                           Added At:
                           <Typography variant="inherit" component="span" pl={1} fontWeight={600} >
                              {prodDetails.createdAt.toDate().toDateString()}
                           </Typography>
                        </Typography>
                     </Stack>
                  </Box>
               </Stack>
            ))
         )}
      </>
   );
};

export default ProductView_page;
