import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { ProdDetailsProps } from './ui.types';


export default function MUi_card({ prodName, prodCategory, prodCompany, prodImg, quantity, getPrice, sellPrice }: ProdDetailsProps) {
   return (
      <Card sx={{ maxWidth: 250 }}>
         <CardActionArea>
            <CardMedia
               component="img"
               height="140"
               // image="https://source.unsplash.com/random"
               image={prodImg}
               alt={prodName}
            />
            <CardContent>
               <Typography gutterBottom variant="h5" component="div">
                  {prodName}
               </Typography>
               <Typography variant="subtitle1" component="div">
                  {prodCategory}
               </Typography>
               <Typography variant="h6" component="div">
                  {sellPrice}
               </Typography>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}
