import { Divider, Stack, Typography } from '@mui/material';
import Head from 'next/head';

const NotFound = () => {
   return (
      <>
         <Head>
            <title>404 · Page Not Found</title>
            <link rel="icon" type="image/webp" href="/img/404-logo.webp" />
         </Head>

         <Stack
            width="100%"
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{
               position: 'absolute',
               top: '50%', right: '50%',
               transform: 'translate(50%,-50%)'
            }}
         >
            <Typography variant='h6' component="p" >404</Typography>
            <Typography variant='body1' component="p" fontWeight={400} textAlign="center" >Page Not Found</Typography>
         </Stack>
      </>
   );
};

export default NotFound;
