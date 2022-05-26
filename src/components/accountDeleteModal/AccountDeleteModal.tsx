import {
   Box,
   IconButton,
   Modal,
   TextField,
   Stack,
   Typography,
   Tooltip,
   Button,
   InputAdornment,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useSession, signOut as signOutProvider, signIn as signInProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database, storage } from "../../config/firebase.config";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import useUser from '../../hooks/useUser';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { deleteObject, ref } from 'firebase/storage';


const style = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '80%',
   height: '75vh',
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   overflowY: 'scroll',
};


export default function AccountDeleteModal() {
   const router = useRouter();
   const { shopAppId } = router.query;

   const { data: session, status } = useSession();


   const { user } = useUser();

   const [open, setOpen] = useState(false);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [password, setPassword] = useState('');

   const [isUrlConfirmed, setIsUrlConfirmed] = useState(false);
   const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
   const [inputChange, setInputChange] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const shop = useAppSelector(selectShopDetails);


   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const [prodIds, setProdIds] = useState([] as string[]);
   // (prodIds.length > 0) && console.log('prod:', prodIds);


   function deleteProducts() {
      return new Promise(resolve => {
         prodIds.forEach(id => {
            // console.log(id);
            const imageRef = ref(storage, `/product-images/${shop?.data?.urlName}/PRODUCT_IMG:${id}`);
            deleteObject(imageRef).then(() => {
               deleteDoc(doc(database, "shops", shop?.data?.urlName, "products", id)).then(() => {
                  // console.log('Deleted');
                  resolve(null);
               });
            });
         });
      });
   }
   function deleteAccount() {
      return new Promise(resolve => {
         (shop?.data) && deleteDoc(doc(database, "shops", shop.data.urlName)).then(() => {
            signOutProvider({ redirect: false }).then(() => {
               user && deleteUser(user).then(() => {
                  // router.reload();
                  resolve(null);
               });
            });
         });
      });
   }

   // const handleAccountDelete = async () => {
   //    const confirmShopUrlName = prompt("Please enter your Shop Url Name :");

   //    if (confirmShopUrlName === shopAppId) {
   //       // await deleteAccount().then(() => {
   //       //    router.push('/');
   //       // });


   //       if (prodIds.length > 0) {
   //          // #if product exist
   //          await deleteProducts().then(() => {
   //             deleteAccount().then(() => {
   //                router.push('/');
   //             });
   //          });
   //       } else {
   //          // #if there is no product exist
   //          await deleteAccount().then(() => {
   //             router.push('/');
   //          });
   //       }


   //       // else {
   //       //    // #if there is no product exist
   //       //    await deleteAccount().then(() => {
   //       //       router.push('/');
   //       //    });
   //       //    // await deleteAccount();
   //       // }


   //       //    if (prodIds.length > 0) {
   //       //       // #if product exist
   //       //       await deleteProducts().then(() => {
   //       //          deleteDoc(doc(database, "shops", shop?.data?.urlName)).then(() => {
   //       //             // console.log('done with delete');

   //       //             // router.push('/');
   //       //             deleteUser(user!).then(() => {
   //       //                // signOutProvider({ callbackUrl: '/' });

   //       //                // signOutProvider({ callbackUrl: '/' });

   //       //                // signOutProvider({ redirect: false }).then(() => {
   //       //                //    router.push('/');
   //       //                // });
   //       //                signOutProvider().then(() => {
   //       //                   router.push('/');
   //       //                });
   //       //                // signOutProvider({ redirect: false });
   //       //                // signOutProvider();
   //       //             });
   //       //          });
   //       //       });
   //       //    } else {
   //       //      // #if there is no product exist
   //       //       await deleteDoc(doc(database, "shops", shop?.data?.urlName)).then(() => {
   //       //          // console.log('done without delete');

   //       //          // router.push('/');
   //       //          deleteUser(user!).then(() => {
   //       //             signOutProvider({ callbackUrl: '/' });
   //       //             // signOutProvider({ callbackUrl: '/' });
   //       //             // signOutProvider({ redirect: false }).then(() => {
   //       //             signOutProvider().then(() => {
   //       //                router.push('/');
   //       //             });
   //       //             // signOutProvider({ redirect: false });
   //       //             signOutProvider();
   //       //          });
   //       //       });
   //       //    }
   //       // } else {
   //       //    alert('You Entered Shop Url Name is Wrong.');
   //       // }
   //    } else {
   //       alert('You Entered Shop Url Name is Wrong.');
   //    }
   // };


   const handleSubmit = (e: any) => {
      e.preventDefault();

      if (isUrlConfirmed && session) {
         signInWithEmailAndPassword(auth, session?.user.email!, password).then((userCredential) => {
            setInputChange(false);
            setIsPasswordConfirmed(true);

            // console.log('passed');
            // router.push(`/${shopUrlNameInput}`);
            handleClose();
         }).then(() => {
            if (prodIds.length > 0) {
               // #if product exist
               deleteProducts().then(() => {
                  deleteAccount().then(() => {
                     router.push('/');
                  });
               });
            } else {
               // #if there is no product exist
               deleteAccount().then(() => {
                  router.push('/');
               });
            }
         })
            .catch((error) => {
               // const errorCode = error.code;
               // const errorMessage = error.message;
               // console.log(errorCode, ' : ', errorMessage);
               // console.log('catch');

               // handleClose();
               setInputChange(false);
               setIsPasswordConfirmed(false);
            });
      }
   };


   useEffect(() => {
      (shop?.data) && onSnapshot(collection(database, 'shops', shop.data.urlName, 'products'), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         // console.log(arr);
         setProdIds(arr);
      });
   }, [database, shop]);

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
   }, [shopUrlNameInput]);

   useEffect(() => {
      setInputChange(true);
   }, [password]);


   return (
      <>
         <Tooltip title="Edit" placement="left" arrow >
            {/* <Button disabled={!user || !(shop?.data)} variant="outlined" size="small" color={'error'} sx={{ textTransform: 'none' }}
               onClick={handleAccountDelete}
            >Delete your account</Button> */}
            <Button variant="outlined" size="small" color={'error'} sx={{ textTransform: 'none' }} onClick={handleOpen} >Delete your account</Button>
         </Tooltip>

         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style} >
               <Box width={'100%'} height={'100%'} p={3}  >
                  <Typography variant='h5' gutterBottom textAlign='center' >Edit Product Details</Typography>

                  <form onSubmit={handleSubmit} >
                     <Stack direction="column" spacing={2}  >
                        {session &&
                           <TextField
                              label="Shop Email"
                              size="small"
                              color="warning"
                              type='email'
                              defaultValue={session.user.email}
                              InputProps={{ readOnly: true }}
                              required
                           />
                        }
                        <TextField
                           label="Shop Url Name"
                           size="small"
                           type='text'
                           value={shopUrlNameInput}
                           onInput={(e: any) => {
                              setShopUrlNameInput(e.target.value.split(" ").join("").toLowerCase());
                           }}
                           helperText={(shopUrlNameInput === '') ? "* Enter your Shop Url Name" : (isUrlConfirmed ? '' : "* You entered Url Name doesn't exist")}
                           color={(shopUrlNameInput === '') ? "primary" : (isUrlConfirmed ? "success" : "error")}
                           error={(shopUrlNameInput !== '') && !isUrlConfirmed}
                           required
                        />
                        <TextField
                           label="Password"
                           size="small"
                           fullWidth
                           type={showPassword ? 'text' : 'password'}
                           value={password}
                           onInput={(e: any) => setPassword(e.target.value)}
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
                     </Stack>
                     <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} py={4}>
                        <Button
                           variant="contained"
                           size='large'
                           color="error"
                           fullWidth
                           onClick={() => setOpen(false)}
                        >Cancel</Button>
                        <LoadingButton
                           variant="contained"
                           type="submit"
                           size='large'
                           fullWidth
                           // loading={loading}
                           loadingPosition="start"
                           startIcon={<PublishRoundedIcon />}
                        >Submit</LoadingButton>
                     </Stack>
                  </form>
               </Box>
            </Box>
         </Modal>
      </>
   );
}
