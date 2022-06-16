import {
   Box,
   Typography,
   Container,
   Stack
} from "@mui/material";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { database } from "../../config/firebase.config";


const Footer = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const [shopDetails, setShopDetails] = useState([] as DocumentData);

   const shopYear = shopDetails?.createdAt?.toDate().getFullYear();


   useEffect(() => {
      onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         snapshot.forEach(obj => {
            setShopDetails(obj.data());
         });
      });
   }, [shopAppUrl]);


   return (
      <Box width={'100%'} py={5} >
         <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack>
               {shopYear && (
                  <Typography variant="body1" >Copyright © {shopYear} {shopDetails.name}</Typography>
               )}
            </Stack>
         </Container>
      </Box>
   );
};

export default Footer;
