// *Welcome page
import type { NextPage } from 'next';

import { Box, colors, Container, Stack, Typography } from '@mui/material';
import { signIn as signInProvider } from "next-auth/react";
import { auth } from '../config/firebase.config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut as signOutAccount } from 'firebase/auth';
import { setAppPageId } from '../redux/slices/pageId.slice';
import { useAppDispatch } from '../redux/hooks';
import { useUser } from '../hooks';
import { LoadingButton } from "@mui/lab";
import Head from 'next/head';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import { App_about, App_help } from '../components/dialogs';


const Home: NextPage = () => {
   const router = useRouter();

   const dispatch = useAppDispatch();

   const { status: userStatus } = useUser();


   const [loading_signup, setLoading_signup] = useState(false);
   const [loading_login, setLoading_login] = useState(false);


   (loading_signup || loading_login) && (setTimeout(() => router.reload(), 60000));


   useEffect(() => {
      sessionStorage.removeItem('secret-access');
   }, []);

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
            direction="column" justifyContent="space-evenly" alignItems="center"
            height={'100vh'}
         >
            <Stack justifyContent="center" spacing={3} >
               <Stack direction="column" alignItems="center">
                  <Box width={{ xs: '25vw', sm: '20vw', md: '15vw' }} pb={1} >
                     <Image
                        alt="Shopitect"
                        src="/img/shopitect-logo.png"
                        width={200}
                        height={200}
                        layout="responsive"
                     />
                  </Box>
                  <Typography fontSize={{ xs: '1.5rem', sm: '3rem' }} component="h1" textAlign="center"  >
                     Welcome to <b>Shopitect</b>
                  </Typography>
                  <Typography variant='body1' textAlign="center" >
                     An architect of shop management application
                  </Typography>
               </Stack>

               <Box>
                  <Typography fontSize={{ xs: '1.1rem', sm: '1.5rem' }} component="p" textAlign="center" pb={1} >Signup/Login with Google</Typography>
                  <Stack direction="row" spacing={2} justifyContent="center" >
                     <LoadingButton
                        variant='contained'
                        color="primary"
                        size='small'
                        onClick={() => {
                           !loading_login && setLoading_signup(true);
                           !loading_login && signOutAccount(auth).then(() => {
                              signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
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
                              signInProvider('google', { redirect: false, callbackUrl: `/auth/login` })
                           );
                        }}
                        loadingPosition="center"
                        loading={loading_login}
                        disabled={(userStatus === 'loading')}
                     >login</LoadingButton>
                  </Stack>
               </Box>
            </Stack>

            <Box component="footer" width={'100%'} pt={8} >
               <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Stack alignItems="center" >
                     <Stack spacing={1} direction="row" justifyContent="center" pb={.5} >
                        <App_about />
                        <App_help />
                     </Stack>
                     <a
                        href="https://github.com/bijink/shopitect"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <GitHubIcon />
                     </a>
                     <Typography variant="body2" >Copyright © 2022 Bijin</Typography>
                  </Stack>
               </Container>
            </Box>
         </Stack>
      </>
   );
};

export default Home;
