import {
   Box,
   Typography,
   Container,
   Stack
} from "@mui/material";
import { useRouter } from "next/router";
import { useShop } from "../../hooks";


const Footer = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const { data: shop } = useShop(shopAppUrl);


   const shopYear = shop?.createdAt && new Date(shop.createdAt.seconds * 1000).getFullYear();


   return (
      <Box width={'100%'} py={5} >
         <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack>
               {shopYear && (
                  <Typography variant="body1" >Copyright © {shopYear} {shop?.name}</Typography>
               )}
            </Stack>
         </Container>
      </Box>
   );
};

export default Footer;
