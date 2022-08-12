// *Signup confirm page
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import { signOut as signOutFromProvider, signIn as signInToProvider, useSession } from "next-auth/react";
import { LoadingButton } from "@mui/lab";
import LoginIcon from '@mui/icons-material/Login';
import UnAuthProvider from "../../components/unAuthProvider";
import { useUser } from "../../hooks";


const SignupConfirm = () => {
   const router = useRouter();

   const { data: session, status: sessionStatus } = useSession();
   // console.log(session?.user);
   const { data: user, status: userStatus } = useUser();

   const [shopUrlName, setShopUrlName] = useState('');

   const [isAccountExist, setIsAccountExist] = useState(false);
   const [loading, setLoading] = useState(false);


   useEffect(() => {
      user && onSnapshot(query(collection(database, 'shops'), where("accountID", "==", user.uid)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data());
            if (sessionStatus === 'authenticated') {
               router.push(`/${obj.data().urlName}`).then(() => {
                  router.reload();
               });
            }
         });
      });
   }, [user, sessionStatus, router]);

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
            router.push('/create');
         }
      });
   }, [session, router]);


   return (
      <>
         <Head>
            <title>Signup · Shopitect</title>
            <link rel="icon" type="image/png" href="/img/shopitect-logo.png" />
         </Head>

         {((sessionStatus === 'unauthenticated') && (
            <UnAuthProvider title="Signup" />
         )) || ((isAccountExist && (userStatus === 'unauthenticated')) && (
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
                        <Typography variant="h4" component="h1" >Shopitect</Typography>
                        <Typography variant="h5" component="div">Confirm Account</Typography>
                        <Box>
                           <Typography variant="body1" component="p">
                              We found that you already have an account from this Gmail.
                           </Typography>
                           <Stack direction={'row'} alignItems="center" justifyContent={'center'}>
                              <Typography variant="body1" component="p">
                                 With the &apos;Shop Url Name&apos; :
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
                                    loadingPosition="center"
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
         )) || (((sessionStatus === 'loading') || (userStatus === 'loading') || !isAccountExist) && (
            <Stack justifyContent="center" alignItems="center" pt={5} >
               <CircularProgress />
            </Stack>
         ))}
      </>
   );
};

export default SignupConfirm;
