import { Box, Stack } from "@mui/material";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../config/firebase.config";
import { ProdDetailsTypes } from "../productCard/product.types";
import MUi_card from "../ui.components/MUi_card";

const ProductCard = () => {
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);

   useEffect(() => {
      onSnapshot(collection(database, 'products'), (snapshot) => {
         setProdDetails(snapshot.docs);
      });
   }, [database]);


   return (
      <Stack
         direction={'row'}
         sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
         {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
            <Box p={1}>
               <MUi_card
                  key={index}
                  prodName={prod.data().prodName}
                  prodImg={'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'}
                  prodCompany={prod.data().prodCompany}
                  prodCategory={prod.data().prodCategory}
                  quantity={prod.data().quantity}
                  getPrice={prod.data().getPrice}
                  sellPrice={prod.data().sellPrice}
               />
            </Box>
         ))}
      </Stack>
   );
};

export default ProductCard;
