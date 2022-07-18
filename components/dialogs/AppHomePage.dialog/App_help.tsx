import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { colors, Typography } from '@mui/material';


export default function App_help() {
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
         >Help</Typography>

         <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
         >
            <DialogTitle id="scroll-dialog-title">Help</DialogTitle>
            <DialogContent>
               <DialogContentText
                  id="scroll-dialog-description"
                  ref={descriptionElementRef}
                  tabIndex={-1}
               >
                  You can simply create  the shop app by clicking the &apos;signup&apos; button at the Home page.
                  <br />
                  Then select your Google account if more than one account is connected to your browser.
                  Otherwise, Shopitect automatically selects the existing account.
                  If no account exists please sign in to Google.
                  <br />
                  After selecting your Google account you will be redirected to the &apos;create app&apos; page. Here you can add all the details about your shop.
                  <br />
                  <br />
                  Each shop app has a unique URL name (Shop Url Name) that is added when creating the shop app.
                  All generated shop apps are accessible through the browser URL by using the Shop Url Name.
                  <br />
                  <br />
                  To access a shop app, add the Shop Url Name after the root URL(shopitect.vercel.app).
                  <br />
                  eg:
                  <Typography
                     component="a"
                     href="https://shopitect.vercel.app/my-shop"
                     target="_blank"
                     rel="noopener noreferrer"
                     pl={1}
                     color={colors.blue[600]}
                     sx={{ fontStyle: 'italic', '&:hover': { cursor: 'pointer', textDecoration: 'underline' } }}
                  >
                     shopitect.vercel.app/my-shop
                  </Typography>
                  <br />
                  Here &apos;my-shop&apos; is the unique Shop Url Name.
               </DialogContentText>
            </DialogContent>
            <DialogActions >
               <Button sx={{ margin: '0 auto' }} onClick={handleClose}>ok</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
