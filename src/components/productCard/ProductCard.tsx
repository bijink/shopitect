import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Box, Stack } from "@mui/material";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../config/firebase.config";
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';

import type { ProdDetailsProps, ProdDetailsTypes } from "../productCard/product.types";


const Cards = ({ shopUrlName, prodId, prodName, prodCategory, prodCompany, prodImg, quantity, getPrice, sellPrice }: ProdDetailsProps) => {
   const router = useRouter();


   return (
      <Box p={1.5} onClick={() => {
         router.push({
            // pathname: '/shop-name/product',
            pathname: `/${shopUrlName}/product`,
            query: { id: prodId },
         });
      }}>
         <Card sx={{ maxWidth: 250 }}>
            <CardActionArea>
               <CardMedia
                  component="img"
                  height="140"
                  // image="https://source.unsplash.com/random"
                  image={prodImg}
                  alt={prodName}
               />
               <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                     {prodName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                     {prodCategory}
                  </Typography>
                  <Typography variant="h6" component="div">
                     {sellPrice}
                  </Typography>
               </CardContent>
            </CardActionArea>
         </Card>
      </Box>
   );
};


const ProductCard = () => {
   // const [prodDetails, setProdDetails] = useState<DocumentData>([]);

   // useEffect(() => {
   //    onSnapshot(collection(database, 'products'), (snapshot) => {
   //       setProdDetails(snapshot.docs);
   //    });
   // }, [database]);


   const shopDetails = useAppSelector(selectShopDetails);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);


   useEffect(() => {
      (shopDetails.shopUrlName) && (
         onSnapshot(collection(database, 'shops', shopDetails.shopUrlName, 'products'), (snapshot) => {
            setProdDetails(snapshot.docs);
            // snapshot.forEach(element => {
            //    console.log(element.data());

            // });
         })
      );
   }, [database, shopDetails.shopUrlName]);


   return (
      <Stack
         direction={'row'}
         sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
      >
         {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
            <Cards
               key={index}
               shopUrlName={shopDetails?.shopUrlName}
               // prodDetails={prod.data()}
               prodId={prod.id}
               prodName={prod.data().prodName}
               prodImg={'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'}
               prodCompany={prod.data().prodCompany}
               prodCategory={prod.data().prodCategory}
               quantity={prod.data().quantity}
               getPrice={prod.data().getPrice}
               sellPrice={prod.data().sellPrice}
            />
         ))}
      </Stack>
   );
};

export default ProductCard;
