import type { ProdDetailsProps } from "../productCard/product.types";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { capitalize, CardActionArea } from '@mui/material';
import { Box } from "@mui/material";
import { useRouter } from 'next/router';


const ProductCard = ({ createdAt, shopUrlName, prodId, prodName, prodCategory, prodBrand, prodImg, quantity, sellPrice }: ProdDetailsProps) => {
   const router = useRouter();


   return (
      <Box p={1.5} onClick={() => {
         router.push({
            pathname: `/${shopUrlName}/product&view`,
            query: { id: prodId },
         });
      }}>
         <Card sx={{ width: 220 }}>
            <CardActionArea>
               <CardMedia
                  component="img"
                  height="140"
                  image={prodImg}
                  alt={capitalize(prodName)}
               />
               <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                     {capitalize(prodName)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                     {capitalize(prodCategory)}
                  </Typography>
                  <Typography variant="h6" component="div">
                     Rs. {sellPrice}
                  </Typography>
                  <Typography variant="inherit" component="div" color="GrayText" >
                     {createdAt.toDate().toDateString()}
                  </Typography>
               </CardContent>
            </CardActionArea>
         </Card>
      </Box>
   );
};

export default ProductCard;
