import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { colors, Typography } from '@mui/material';


export default function App_about() {
   const [open, setOpen] = React.useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const descriptionElementRef = React.useRef<HTMLElement>(null);
   React.useEffect(() => {
      if (open) {
         const { current: descriptionElement } = descriptionElementRef;
         if (descriptionElement !== null) {
            descriptionElement.focus();
         }
      }
   }, [open]);


   return (
      <div>
         <Typography
            variant="body2"
            color={colors.blue[700]}
            sx={{ '&:hover': { cursor: 'pointer', textDecoration: 'underline' } }}
            onClick={handleClickOpen}
         >About</Typography>

         <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
         >
            <DialogTitle id="scroll-dialog-title">About</DialogTitle>
            <DialogContent>
               <DialogContentText
                  id="scroll-dialog-description"
                  ref={descriptionElementRef}
                  tabIndex={-1}
               >
                  <Typography variant='h4' component='span' >
                     Shopitect
                  </Typography>
                  <br />
                  <Typography variant='subtitle2' component='span' >
                     An architect of Shop Management Application
                  </Typography>
                  <br />
                  <br />

                  Shopitect is an app that generates shop management applications. Mostly useful for <span style={{ whiteSpace: 'nowrap' }}>small-scale</span> shops.
                  <br />
                  Anyone who has a Google account can simply create a shop app by signing into the shopitect app.
                  <br />
                  Generated shop apps are simple apps that can store the details of products in the shop in a digital form.
                  This shop app can also use as a small <span style={{ whiteSpace: 'nowrap' }}>e-commerce</span> website to simply show the details of products to the shop clients.

               </DialogContentText>
            </DialogContent>
            <DialogActions >
               <Button sx={{ margin: '0 auto' }} onClick={handleClose}>ok</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
