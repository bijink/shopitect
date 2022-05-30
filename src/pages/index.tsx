// *Welcome page
import type { GetServerSideProps, NextPage } from 'next';
import type { GoogleProviderTypes } from "../types/pages/googleProvider.types";

import { Box, Stack, Typography } from '@mui/material';
import { getProviders, signIn as signInProvider, useSession } from "next-auth/react";
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

   // const { data: session } = useSession();
   // console.log(session);

   const dispatch = useAppDispatch();

   const { status: userStatus } = useUser();
   // console.log(userStatus);

   const [loading_signup, setLoading_signup] = useState(false);
   const [loading_login, setLoading_login] = useState(false);


   (loading_signup || loading_login) && (setTimeout(() => router.reload(), 60000));


   useEffect(() => {
      dispatch(setAppPageId('appHome_page'));
   }, []);


   return (
      <>
         <Head>
            <title>Shopitect</title>
            <meta name="description" content="An architect of shop management application" />
            <meta property="og:title" content="Shopitect" key="title" />
         </Head>

         <Stack
            direction="column" justifyContent="center" alignItems="center"
            spacing={5}
            height={'100vh'}
         >
            <Stack direction="column" alignItems="center">
               <Typography variant='h3' component="h1" >
                  Welcome to <b>Shopitect</b>
               </Typography>
               <Typography variant='body1'>
                  An architect of shop management application
               </Typography>
            </Stack>

            <Box>
               {Object.values(providers).map((provider) => (
                  <Box key={provider.id}>
                     <Typography variant='h5' component="p" pb={1} >Signup/Login with {provider.name}</Typography>
                     <Stack direction="row" spacing={2} justifyContent="center" >
                        <LoadingButton
                           variant='contained'
                           color="primary"
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
                           color={(userStatus === 'authenticated') ? 'success' : 'info'}
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
