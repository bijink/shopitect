import type { ProdCardProps } from "./productCard.types";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { capitalize, CardActionArea } from '@mui/material';
import { Box } from "@mui/material";
import { useRouter } from 'next/router';
import Image from "next/image";


const ProductCard = ({ shopUrlName, prodId, prodName, prodCategory, prodImg, sellPrice }: ProdCardProps) => {
   const router = useRouter();

   const cardWidth = 220;


   return (
      <Box p={1} >
         <Card sx={{ width: cardWidth }} onClick={() => {
            router.push({
               pathname: `/${shopUrlName}/product/view`,
               query: { id: prodId },
            });
         }}>
            <CardActionArea>
               <Image
                  alt={`product:${capitalize(prodName)}`}
                  src={prodImg}
                  placeholder='blur'
                  blurDataURL={prodImg}
                  width={cardWidth}
                  height={130}
                  style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }}
               />
               <CardContent sx={{ paddingX: 1, paddingY: 0.5 }} >
                  <Typography variant="body1" component="h3" sx={{ fontWeight: 600 }} >
                     {capitalize(prodName)}
                  </Typography>
                  <Typography variant="inherit" component="p" color="GrayText" >
                     {capitalize(prodCategory)}
                  </Typography>
                  <Typography variant="subtitle2" component="p">
                     &#x20B9; {sellPrice}
                  </Typography>
               </CardContent>
            </CardActionArea>
         </Card>
      </Box>
   );
};

export default ProductCard;
