// *Welcome page
import { Button, Stack, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
   return (
      <>
         <Head>
            <title>master-project-app</title>
            <meta name="description" content="" />
         </Head>
         <Stack direction={"column"} height={'100vh'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h1' >
               Application Welcome Page
            </Typography>


            <Button variant='contained'>
               <Link href="/auth/signin">Create App</Link>
            </Button>
            <Button variant='text' color="success" size='small'>
               <Link href="/auth/signin?isApp=true">Already Have One</Link>
            </Button>
         </Stack>
      </>
   );
};

export default Home;
