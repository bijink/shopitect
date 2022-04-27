import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


export default function MUi_card() {
   return (
      <Card sx={{ maxWidth: 250 }}>
         <CardActionArea>
            <CardMedia
               component="img"
               height="140"
               // image="https://source.unsplash.com/random"
               image="https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080"
               alt="green iguana"
            />
            <CardContent>
               <Typography gutterBottom variant="h5" component="div">
                  productName
               </Typography>
               <Typography variant="subtitle1" component="div">
                  categoryName
               </Typography>
               <Typography variant="h6" component="div">
                  price
               </Typography>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}
