// *Signin page
import type { GetServerSideProps, NextPage } from "next";
import type { GoogleProviderTypes } from "../../../types/pages/signin.types";

import Head from "next/head";
import { getProviders, signIn as signInToProvider } from "next-auth/react";
import { Box, Button, Stack, Typography } from "@mui/material";


const Signin: NextPage<GoogleProviderTypes> = ({ providers }) => {
   return (
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
                  <Typography variant="h4" component="h1">My Master Project Name</Typography>
                  <Typography variant="h5" component="div">Sign In</Typography>
                  <Box>
                     {Object.values(providers).map((provider) => (
                        <Box key={provider.name}>
                           <Button
                              variant="contained"
                              onClick={() => {
                                 signInToProvider(provider.id, { callbackUrl: `/auth/signin/confirm` });
                              }}
                           >
                              Sign in with {provider.name}
                           </Button>
                        </Box>
                     ))}
                  </Box>
               </Stack>
            </Box>
         </Box>
      </>
   );
};


export const getServerSideProps: GetServerSideProps = async () => {
   const providers = await getProviders();

   return { props: { providers } };
};

export default Signin;
