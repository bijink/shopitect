// *Welcome page
import type { GetServerSideProps, NextPage } from 'next';
import type { GoogleProviderTypes } from "../types/pages/googleProvider.types";

import Head from 'next/head';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getProviders, signIn as signInProvider } from "next-auth/react";
import { auth } from '../config/firebase.config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut as signOutAccount } from 'firebase/auth';


const Home: NextPage<GoogleProviderTypes> = ({ providers }) => {
   const router = useRouter();

   const [isUser, setIsUser] = useState(false);


   useEffect(() => {
      auth.onAuthStateChanged(user => {
         // console.log(user);
         user ? setIsUser(true) : setIsUser(false);
      });
   });


   return (
      <>
         <Head>
            <title>master-project-app</title>
            <meta name="description" content="" />
         </Head>

         <Stack
            direction={"column"}
            spacing={5}
            height={'100vh'}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
         >
            <Typography variant='h3' component="h1" >
               Application Welcome Page
            </Typography>

            <Box>
               {Object.values(providers).map((provider) => (
                  <Box key={provider.id}>
                     <Typography variant='h5' component="p" pb={1} >Signup/Login with {provider.name}</Typography>
                     <Stack direction="row" spacing={2} justifyContent="center" >
                        <Button
                           variant="contained"
                           color="primary"
                           onClick={() => {
                              signOutAccount(auth).then(() => {
                                 signInProvider(provider.id, { redirect: false, callbackUrl: `/auth/signup` });
                              });
                           }}
                        >
                           signup
                        </Button>
                        <Button
                           variant='contained'
                           color="info"
                           onClick={() => {
                              !isUser
                                 ? signInProvider(provider.id, { redirect: false, callbackUrl: `/auth/login` })
                                 : router.push(`/auth/login`);
                           }}
                        >
                           login
                        </Button>
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
