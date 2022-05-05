import { Box } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import PublicSection_layout from "../../layouts/PublicSection.layout";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";


const Product: NextPage = () => {
   const router = useRouter();
   const { id } = router.query;

   const [prodDetails, setProdDetails] = useState<DocumentData | any>([]);


   useEffect(() => {
      if (id) {
         getDoc(doc(database, 'products', id)).then((snap) => {
            // console.log(snap.data());
            setProdDetails(snap.data());
         });
      }
   }, [id]);


   return (
      <>
         <Head>
            <title>shopName</title>
            <meta name="description" content="" />
         </Head>
         <PublicSection_layout>
            <Box p={1.5} >
               <Card sx={{ width: '70vw', height: '70vh' }}>
                  <CardActionArea>
                     <CardMedia
                        component="img"
                        height="140"
                        image='https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'
                        // image={prodDetails.prodImg}
                        alt={prodDetails.prodName}
                     />
                     <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                           {prodDetails.prodName}
                        </Typography>
                        <Typography variant="subtitle1" component="div">
                           {prodDetails.prodCategory}
                        </Typography>
                        <Typography variant="h6" component="div">
                           {prodDetails.sellPrice}
                        </Typography>
                     </CardContent>
                  </CardActionArea>
               </Card>
            </Box>
         </PublicSection_layout>
      </>
   );
};

export default Product;
