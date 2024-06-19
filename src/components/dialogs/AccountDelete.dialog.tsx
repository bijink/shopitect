import {
   Box,
   IconButton,
   TextField,
   Stack,
   Typography,
   Button,
   InputAdornment,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   colors,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { deleteDoc, doc } from 'firebase/firestore';
import { useSession, signOut as signOutProvider } from "next-auth/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database, storage } from "../../config/firebase.config";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useShop, useUser } from '../../hooks';
import { deleteObject, ref } from 'firebase/storage';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useRouter } from 'next/router';


export default function AccountDelete_dialog() {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const { data: session } = useSession();
   const { data: user } = useUser();
   const { data: shop } = useShop(shopAppUrl);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [password, setPassword] = useState('');
   const [prodIds, setProdIds] = useState([] as string[]);

   const [dialogOpen, setDialogOpen] = useState(false);
   const [isUrlConfirmed, setIsUrlConfirmed] = useState(false);
   const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
   const [inputChange, setInputChange] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [loading_delete, setLoading_delete] = useState(false);


   const handleDialogOpen = () => {
      setDialogOpen(true);

      setShopUrlNameInput('');
      setPassword('');
   };

   const handleDialogClose = () => {
      setDialogOpen(false);
   };


   function deleteProducts() {
      return new Promise(resolve => {
         prodIds.forEach(id => {
            // console.log(id);
            const imageRef = ref(storage, `/${shop?.urlName}/product-images/PRODUCT_IMG:${id}`);
            deleteObject(imageRef).then(() => {
               deleteDoc(doc(database, "shops", shop?.urlName!, "products", id)).then(() => {
                  // console.log('Deleted');
                  resolve(null);
               });
            });
         });
      });
   }
   function deleteAccount() {
      return new Promise(resolve => {
         router.push('/').then(() => {
            const imageRef = ref(storage, `/${shop?.urlName}/shop-logo`);
            deleteObject(imageRef).then(() => {
               (shop) && deleteDoc(doc(database, "shops", shop.urlName)).then(() => {
                  sessionStorage.removeItem('shop-details');

                  user && deleteUser(user).then(() => {
                     // signOutProvider({ callbackUrl: '/' }).then(() => {
                     signOutProvider({ redirect: false }).then(() => {
                        resolve(null);
                     });
                  });
               });
            });
         });
      });
   }

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isUrlConfirmed && session) {
         setLoading_delete(true);

         const credential = EmailAuthProvider.credential(
            session.user.email!,
            password
         );

         await reauthenticateWithCredential(user!, credential).then(() => {
            if (prodIds.length > 0) {
               // #if product exist
               deleteProducts().then(() => {
                  deleteAccount().then(() => {
                     handleDialogClose();
                  });
               });
            } else {
               // #if there is no product exist
               deleteAccount().then(() => {
                  handleDialogClose();
               });
            }
            setLoading_delete(false);
         }).catch((error) => {
            console.error(error.message);

            setLoading_delete(false);
            setInputChange(false);
            setIsPasswordConfirmed(false);
         });
      }
   };


   useEffect(() => {
      shop && onSnapshot(collection(database, 'shops', shop.urlName, 'products'), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         // console.log(arr);
         setProdIds(arr);
      });
   }, [shop]);

   useEffect(() => {
      session && onSnapshot(query(collection(database, 'shops'), where("email", "==", session?.user.email)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data().urlName);
            if (shopUrlNameInput === obj.data().urlName) {
               setIsUrlConfirmed(true);
            } else {
               setIsUrlConfirmed(false);
            }
         });
      });
   }, [session, shopUrlNameInput]);

   useEffect(() => {
      setInputChange(true);
   }, [password]);


   return (
      <Box>
         <Button variant="outlined" size="small" color={'error'} sx={{ textTransform: 'none' }} onClick={handleDialogOpen} >Delete your account</Button>

         <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
               <Stack direction='row' alignItems="center" spacing={1}>
                  <ReportProblemIcon color='error' />
                  <Typography variant='h5' color="error" >
                     Delete this Shop Account?
                  </Typography>
               </Stack>
            </DialogTitle>
            <form onSubmit={handleSubmit} >
               <DialogContent>
                  <Typography pb={2}>
                     Doing so will permanently delete the data at this Account, including all shop and product details.
                  </Typography>
                  {session &&
                     <TextField
                        margin="dense"
                        id="email"
                        fullWidth
                        variant="standard"
                        label="Shop Email Address"
                        size="small"
                        color="warning"
                        type='email'
                        defaultValue={session.user.email}
                        InputProps={{ readOnly: true }}
                     />
                  }
                  <TextField
                     margin="dense"
                     id="name"
                     fullWidth
                     variant="standard"
                     label="Shop Url Name"
                     size="small"
                     type='text'
                     value={shopUrlNameInput}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        setShopUrlNameInput(e.target.value.split(" ").join("").toLowerCase());
                     }}
                     helperText={(shopUrlNameInput === '') ? "* Enter your Shop Url Name" : (isUrlConfirmed ? '' : "* You entered wrong Url Name")}
                     color={(shopUrlNameInput === '') ? "primary" : (isUrlConfirmed ? "success" : "error")}
                     error={(shopUrlNameInput !== '') && !isUrlConfirmed}
                     required
                  />
                  <TextField
                     margin="dense"
                     id="password"
                     fullWidth
                     variant="standard"
                     label="Password"
                     size="small"
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                     InputProps={{
                        endAdornment: <InputAdornment position="end">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(prev => !prev)}
                              edge="end"
                           >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                           </IconButton>
                        </InputAdornment>
                     }}
                     helperText={((password === '') || inputChange) ? '' : (!isPasswordConfirmed && '* Wrong password')}
                     color={((password === '') || inputChange) ? "primary" : (isPasswordConfirmed ? 'success' : 'error')}
                     disabled={!isUrlConfirmed}
                     error={((password === '') || inputChange) ? false : !isPasswordConfirmed}
                     required
                  />
               </DialogContent>
               <DialogActions>
                  <Button sx={{ color: colors.grey[600] }} onClick={handleDialogClose}>Cancel</Button>
                  <LoadingButton
                     type="submit"
                     loading={loading_delete}
                     loadingPosition="center"
                     color="error"
                     disabled={!isUrlConfirmed}
                  >Delete</LoadingButton>
               </DialogActions>
            </form>
         </Dialog>
      </Box>
   );
}
