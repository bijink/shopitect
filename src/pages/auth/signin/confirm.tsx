// *ShopUrlName confirm
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import { useSession } from "next-auth/react";


const ShopUrlConfirm = () => {
   const router = useRouter();
   const { url } = router.query;

   const { data: session } = useSession();

   const [shopUrlNameWithSession, setShopUrlNameWithSession] = useState('');
   const [haveToComfirm, setHaveToComfirm] = useState(false);


   useEffect(() => {
      session &&
         onSnapshot(query(collection(database, 'shops'), where('shopAuthId', '==', session.user.uid)), (snapshot) => {
            snapshot.forEach(obj => {
               setShopUrlNameWithSession(obj.data().shopUrlName);
            });
         });
   }, [session]);

   useEffect(() => {
      if (url && session) {
         if (url == shopUrlNameWithSession) router.push(`/${shopUrlNameWithSession}`);
         else setHaveToComfirm(true);
      }
   }, [shopUrlNameWithSession]);


   if (haveToComfirm) return (
      <>
         <Head>
            <title>Sign In - master-project</title>
         </Head>

         <Box
            height={'100vh'}
            display="flex" justifyContent="center" alignItems="center"
         >
            <Box
               px={3} py={8}
               borderRadius={1.5}
               sx={{ backgroundColor: 'whitesmoke' }}
            >
               <Stack spacing={3} alignItems="center">
                  <Typography variant="h4" component="h1" >My Master Project Name</Typography>
                  <Typography variant="h5" component="div">Sign In</Typography>

                  <Box>
                     <Typography variant="body1" component="p">
                        We found a mismatch in your Google account with entered Shop Url Name
                     </Typography>
                     <Typography variant="body1" component="p">
                        Correct Shop Url Name according with your Google account is
                        <Typography component={'span'} sx={{ fontWeight: 'bold' }}> {shopUrlNameWithSession}</Typography>
                     </Typography>
                     <Stack pt={2} spacing={1} direction={'column'} alignItems="center">
                        <Typography>Click OK to open
                           <Typography component={'span'} sx={{ fontWeight: 'bold' }}> {shopUrlNameWithSession}</Typography>
                        </Typography>
                        <Button variant="contained" size='small' onClick={() => {
                           router.push(`/${shopUrlNameWithSession}`);
                        }}>OK</Button>
                     </Stack>
                  </Box>
               </Stack>
            </Box>
         </Box>
      </>
   );
   return (<Head> <title>Sign In - master-project</title></Head>);
};

export default ShopUrlConfirm;
