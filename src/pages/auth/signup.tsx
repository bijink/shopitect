// *Signup confirm page
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import { signOut as signOutFromProvider, signIn as signInToProvider, useSession } from "next-auth/react";
import { LoadingButton } from "@mui/lab";
import LoginIcon from '@mui/icons-material/Login';
import UnAuthProvider from "../../components/unAuthProvider";


const SignupConfirm = () => {
   const router = useRouter();

   const { data: session, status } = useSession();
   // console.log(session?.user);

   const user = auth.currentUser;

   const [shopUrlName, setShopUrlName] = useState('');

   const [isAccountExist, setIsAccountExist] = useState(false);
   const [loading, setLoading] = useState(false);


   useEffect(() => {
      user && onSnapshot(query(collection(database, 'shops'), where("accountID", "==", user.uid)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data());
            if (status == 'authenticated') {
               router.push(`/${obj.data().urlName}`);
            }
         });
      });
   }, [user, status]);

   useEffect(() => {
      session && onSnapshot(query(collection(database, 'shops'), where('providerID', '==', session.user.uid)), (snapshot) => {
         // console.log('data:', snapshot.docs.length);
         if (snapshot.docs.length === 1) {
            // #if there is an existing account
            setIsAccountExist(true);
            snapshot.forEach(obj => {
               setShopUrlName(obj.data().urlName);
            });
         } else {
            // #if there is no existing account 
            router.push('/create-app');
         }
      });
   }, [session]);


   if (status == 'unauthenticated') return (
      <UnAuthProvider title="Signup" />
   );
   else return (
      <>
         <Head>
            <title>Signup - master-project</title>
         </Head>

         {(isAccountExist && !user) && (
            <>
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
                              <Typography>Do you want to login into
                                 <Typography component={'span'} sx={{ fontWeight: 'bold' }}> {shopUrlName} ?</Typography>
                              </Typography>
                              <Stack direction="row" spacing={2}>
                                 <Button variant="contained" size='small' color="error" onClick={() => {
                                    signOutFromProvider({ redirect: false, callbackUrl: "/" });
                                 }}>cancel</Button>
                                 <LoadingButton
                                    variant="contained"
                                    size='small'
                                    loading={loading}
                                    loadingPosition="end"
                                    endIcon={<LoginIcon />}
                                    onClick={() => {
                                       setLoading(true);
                                       router.push('/auth/login').then(() => {
                                          setLoading(false);
                                       });
                                    }}
                                 >login</LoadingButton>
                              </Stack>
                           </Stack>
                        </Box>
                     </Stack>
                  </Box>
               </Box>
            </>
         )}
      </>
   );
};

export default SignupConfirm;
