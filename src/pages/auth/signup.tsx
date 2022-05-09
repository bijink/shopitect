// *Signup confirm page
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { useSession } from "next-auth/react";


const SignupConfirm = () => {
   const router = useRouter();

   const { data: session } = useSession();
   // console.log(session?.user);

   const [delayOver, setDelayOver] = useState(false);
   const [isAlreadyHaveAccount, setIsAlreadyHaveAccount] = useState(false);
   // delayOver && console.log(isAlreadyHaveAccount);
   const [shopUrlName, setShopUrlName] = useState('');


   useEffect(() => {
      session && onSnapshot(collection(database, 'shops'), (snapshot) => {
         const shopGoogleAuthIds: Array<string> = [];
         snapshot.forEach(obj => {
            // console.log(obj.data().shopGoogleAuthId);
            shopGoogleAuthIds.push(obj.data().shopGoogleAuthId);
         });
         // console.log(shopGoogleAuthIds.some(arr => arr == session.user.uid));
         setIsAlreadyHaveAccount(shopGoogleAuthIds.some(arr => arr == session.user.uid));
         setDelayOver(true);
      });

      session && onSnapshot(query(collection(database, 'shops'), where('shopGoogleAuthId', '==', session.user.uid)), (snapshot) => {
         snapshot.forEach(obj => {
            setShopUrlName(obj.data().shopUrlName);
         });
      });
   }, [session]);

   useEffect(() => {
      if (delayOver && !isAlreadyHaveAccount) router.push('/create-app');
   }, [isAlreadyHaveAccount, delayOver]);


   if (isAlreadyHaveAccount) return (
      <>
         <Head>
            <title>Signup - master-project</title>
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
                  <Typography variant="h5" component="div">Confirm Account</Typography>
                  <Box>
                     <Typography variant="body1" component="p">
                        We found that you already have an account from this Gmail.
                     </Typography>
                     <Stack direction={'row'} alignItems="center" justifyContent={'center'}>
                        <Typography variant="body1" component="p">
                           With the 'Shop Url Name' :
                        </Typography>
                        <Typography component={'span'} sx={{ fontWeight: 'bold' }} pl={1}>
                           {shopUrlName}
                        </Typography>
                     </Stack>
                     <Stack pt={2} spacing={1} direction={'column'} alignItems="center">
                        <Typography>Do you want to go with
                           <Typography component={'span'} sx={{ fontWeight: 'bold' }}> {shopUrlName} ?</Typography>
                        </Typography>
                        <Stack direction="row" spacing={2}>
                           <Button variant="contained" size='small' color="error" onClick={() => {
                              router.push(`/`);
                           }}>no</Button>
                           <Button variant="contained" size='small' color="primary" onClick={() => {
                              router.push(`/${shopUrlName}`);
                           }}>yes</Button>
                        </Stack>
                     </Stack>
                  </Box>
               </Stack>
            </Box>
         </Box>
      </>
   );
   return (<Head> <title>Signup - master-project</title></Head>);
};

export default SignupConfirm;
