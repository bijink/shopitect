import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';


const Home: NextPage = () => {
   return (
      <>
         <Head>
            <title>master-project-app</title>
            <meta name="description" content="" />
         </Head>

         <Typography variant='h1' height={'100vh'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Application Welcome Page
         </Typography>
      </>
   );
};

export default Home;
