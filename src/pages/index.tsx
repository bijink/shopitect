// *Welcome page
import type { GetServerSideProps, NextPage } from 'next';
import type { GoogleProviderTypes } from "../types/pages/googleProvider.types";

import Head from 'next/head';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getProviders, signIn as signInToProvider } from "next-auth/react";


const Home: NextPage<GoogleProviderTypes> = ({ providers }) => {
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
                              signInToProvider(provider.id, { callbackUrl: `/auth/signup` });
                           }}
                        >
                           signup
                        </Button>
                        <Button
                           variant='contained'
                           color="info"
                           onClick={() => {
                              signInToProvider(provider.id, { callbackUrl: `/auth/login` });
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
