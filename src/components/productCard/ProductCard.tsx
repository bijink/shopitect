import type { ProdDetailsProps, ProdDetailsTypes } from "../productCard/product.types";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { capitalize, CardActionArea } from '@mui/material';
import { Box, Stack } from "@mui/material";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../config/firebase.config";
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';


const Cards = ({ createdAt, shopUrlName, prodId, prodName, prodCategory, prodBrand, prodImg, quantity, sellPrice }: ProdDetailsProps) => {
   const router = useRouter();


   return (
      <Box p={1.5} onClick={() => {
         router.push({
            pathname: `/${shopUrlName}/product&view`,
            query: { id: prodId },
         });
      }}>
         <Card sx={{ width: 220 }}>
            <CardActionArea>
               <CardMedia
                  component="img"
                  height="140"
                  image={prodImg}
                  alt={capitalize(prodName)}
               />
               <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                     {capitalize(prodName)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                     {capitalize(prodCategory)}
                  </Typography>
                  <Typography variant="h6" component="div">
                     Rs. {sellPrice}
                  </Typography>
                  <Typography variant="inherit" component="div" color="GrayText" >
                     {createdAt.toDate().toDateString()}
                  </Typography>
               </CardContent>
            </CardActionArea>
         </Card>
      </Box>
   );
};


const ProductCard = () => {
   const shopDetails = useAppSelector(selectShopDetails);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);


   useEffect(() => {
      onSnapshot(collection(database, 'shops', shopDetails?.urlName, 'products'), (snapshot) => {
         setProdDetails(snapshot.docs);
         setFetchDelayOver(true);
      });
   }, [database, shopDetails]);


   if (fetchDelayOver && (prodDetails.length === 0)) return (
      <Stack sx={{ justifyContent: 'center', alignItems: 'center' }} >
         <Typography variant="h5" component="p" >No Products</Typography>
      </Stack>
   );
   return (
      <Stack
         direction={'row'}
         sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
      >
         {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
            <Cards
               key={index}

               shopUrlName={shopDetails?.urlName}

               prodId={prod.id}
               prodName={prod.data().name}
               prodImg={prod.data().imageUrl}
               prodBrand={prod.data().brand}
               prodCategory={prod.data().category}
               quantity={prod.data().quantity}
               getPrice={prod.data().getPrice}
               sellPrice={prod.data().sellPrice}
               createdAt={prod.data().createdAt}
            />
         ))}
      </Stack>
   );
};

export default ProductCard;
