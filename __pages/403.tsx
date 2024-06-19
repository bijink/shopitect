import { Divider, Stack, Typography } from "@mui/material";
import Head from "next/head";

const Forbidden = () => {
   return (
      <>
         <Head>
            <title>403 · Forbidden</title>
            <link rel="icon" type="image/webp" href="/img/403-logo.webp" />
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
            <Typography variant='h6' component="p" >403</Typography>
            <Typography variant='body1' component="p" fontWeight={400} textAlign="center" >You Have No Access To This Page</Typography>
         </Stack>
      </>
   );
};

export default Forbidden;
