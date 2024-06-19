import type { LogoutConfirmProps } from './dialogs.types';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { colors, MenuItem, Typography } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRouter } from 'next/router';
import { auth } from '../../config/firebase.config';
import { signOut as signOutProvider } from 'next-auth/react';
import { signOut as signOutAccount } from 'firebase/auth';


export default function LogoutConfirm_dialog({ handleMenuClose }: LogoutConfirmProps) {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const [open, setOpen] = React.useState(false);


   const handleClickOpen = () => {
      setOpen(true);
      handleMenuClose();
   };
   const handleClose = () => {
      setOpen(false);
   };

   const handleLogout = () => {
      handleClose();

      router.push(`/${shopAppUrl}`).then(() => {
         signOutProvider({ redirect: false }).then(() => {
            signOutAccount(auth);
         });
      });
   };


   return (
      <div>
         <MenuItem onClick={handleClickOpen}>
            <LogoutOutlinedIcon />
            <Typography pl={1} >Log out</Typography>
         </MenuItem>

         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">
               {`Log out from ${shopAppUrl}?`}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure, you want to log out from this app?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button sx={{ color: colors.grey[600] }} onClick={handleClose}>no</Button>
               <Button color="error" onClick={handleLogout} autoFocus>yes</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
