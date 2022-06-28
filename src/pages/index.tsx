// *Welcome page
import type { GetServerSideProps, NextPage } from 'next';
import type { GoogleProviderTypes } from "../types/pages/googleProvider.types";

import { Box, colors, Stack, Typography } from '@mui/material';
import { getProviders, signIn as signInProvider } from "next-auth/react";
import { auth } from '../config/firebase.config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut as signOutAccount } from 'firebase/auth';
import { setAppPageId } from '../redux/slices/pageId.slice';
import { useAppDispatch } from '../redux/hooks';
import { useUser } from '../hooks';
import { LoadingButton } from "@mui/lab";
import Head from 'next/head';


const Home: NextPage<GoogleProviderTypes> = ({ providers }) => {
   const router = useRouter();

   const dispatch = useAppDispatch();

   const { status: userStatus } = useUser();


   const [loading_signup, setLoading_signup] = useState(false);
   const [loading_login, setLoading_login] = useState(false);


   (loading_signup || loading_login) && (setTimeout(() => router.reload(), 60000));


   useEffect(() => {
      dispatch(setAppPageId('appHome_page'));
   }, [dispatch]);


   return (
      <>
         <Head>
            <title>Shopitect</title>
            <link rel="icon" type="image/png" href="/img/shopitect-logo.png" />
         </Head>

         <Stack
            direction="column" justifyContent="center" alignItems="center"
            spacing={5}
            height={'100vh'}
         >
            <Stack direction="column" alignItems="center">
               <Typography fontSize={{ xs: '1.5rem', sm: '3rem' }} component="h1" textAlign="center"  >
                  Welcome to <b>Shopitect</b>
               </Typography>
               <Typography variant='body1' textAlign="center" >
                  An architect of shop management application
               </Typography>
            </Stack>

            <Box>
               {Object.values(providers).map((provider) => (
                  <Box key={provider.id}>
                     <Typography variant='h5' component="p" textAlign="center" pb={1} >Signup/Login with {provider.name}</Typography>
                     <Stack direction="row" spacing={2} justifyContent="center" >
                        <LoadingButton
                           variant='contained'
                           color="primary"
                           size='small'
                           onClick={() => {
                              !loading_login && setLoading_signup(true);
                              !loading_login && signOutAccount(auth).then(() => {
                                 signInProvider(provider.id, { redirect: false, callbackUrl: `/auth/signup` });
                              });
                           }}
                           loadingPosition="center"
                           loading={loading_signup}
                           disabled={(userStatus === 'loading')}
                        >signup</LoadingButton>
                        <LoadingButton
                           variant='contained'
                           size='small'
                           sx={{
                              bgcolor: (userStatus === 'authenticated') ? colors.green[700] : colors.teal[600],
                              '&:hover': { bgcolor: (userStatus === 'authenticated') ? colors.green[800] : colors.teal[700], }
                           }}
                           onClick={() => {
                              !loading_signup && setLoading_login(true);
                              !loading_signup && ((userStatus === 'authenticated') ?
                                 router.push(`/auth/login`) :
                                 signInProvider(provider.id, { redirect: false, callbackUrl: `/auth/login` })
                              );
                           }}
                           loadingPosition="center"
                           loading={loading_login}
                           disabled={(userStatus === 'loading')}
                        >login</LoadingButton>
                     </Stack>
                  </Box>
               ))}
            </Box>
         </Stack>
      </>
   );
};

export const getServerSideProps: GetServerSideProps = async () => {
   const providers = await getProviders();

   return { props: { providers } };
};

export default Home;
