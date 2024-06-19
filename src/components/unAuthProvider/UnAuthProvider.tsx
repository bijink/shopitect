import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, Stack, Typography } from "@mui/material";
import { signIn as signInProvider } from "next-auth/react";


const UnAuthProvider = ({ title }: { title: string; }) => {
   const router = useRouter();

   return (
      <>
         <Head>
            <title>{title} · Shopitect</title>
         </Head>

         <Box display="flex" justifyContent="center" alignItems="center" p={5} >
            <Box>
               <Typography variant="h5" component="p" gutterBottom>
                  You haven&apos;t selected a google account
               </Typography>
               <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" size='small' color="error" onClick={() => {
                     router.push('/');
                  }}>go back</Button>
                  <Button variant="contained" size='small' color="primary" onClick={() => {
                     signInProvider('google');
                  }}>select</Button>
               </Stack>
            </Box>
         </Box>
      </>
   );
};

export default UnAuthProvider;
