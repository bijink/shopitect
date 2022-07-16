import type { NextPage } from "next";

import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Container, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { database, auth, storage } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useRouter } from "next/router";
import { signIn as signInProvider, useSession } from "next-auth/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Head from "next/head";
import { setAppPageId } from "../redux/slices/pageId.slice";
import { useAppDispatch } from "../redux/hooks";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ImageCropper } from "../components/dialogs";


const Create_app: NextPage = () => {
   const router = useRouter();

   const dispatch = useAppDispatch();

   const { data: session, status: sessionStatus } = useSession();

   const inputFocusRef = useRef<any>(null);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopEmail, setShopEmail] = useState('');
   const [shopAddress, setShopAddress] = useState('');
   const [shopUrlName, setShopUrlName] = useState('');
   const [password, setPassword] = useState('');
   const [shopLogo, setShopLogo] = useState<Blob | null>(null);

   const [loading, setLoading] = useState(false);
   const [isShopUrlNameUnique, setIsShopUrlNameUnique] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [isAccountNotExist, setIsAccountNotExist] = useState(false);

   // #isFormSubmit: for fixing state change of 'shopUrlNameUnique' after shopData uploaded into db
   // #causing ui change in form
   const [isFormSubmit, setIsFormSubmit] = useState(false);


   const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // #shopUrlName is used as documentID in firebase firestore as a unique id
      if (session && isShopUrlNameUnique && (password.length >= 8) && shopLogo) {
         setLoading(true);
         setIsFormSubmit(true);

         await createUserWithEmailAndPassword(auth, shopEmail, password).then((userCredential) => {
            // Signed in 
            // const user = userCredential.user;
            // ...
            updateProfile(auth.currentUser!, { displayName: shopUrlName, photoURL: session.user.image }).then(() => {
               // console.log(auth.currentUser);
               setDoc(doc(database, 'shops', shopUrlName), {
                  name: shopName,
                  urlName: shopUrlName,
                  category: shopCategory,
                  ownerName: shopOwnerName,
                  address: shopAddress,
                  email: shopEmail,
                  // # providerID means 'Google auth user uid (integrated using firebase and nextAuth)'
                  providerID: session?.user.uid,
                  // # accountID means 'firebase auth user uid'
                  accountID: auth.currentUser?.uid,
                  createdAt: serverTimestamp(),
                  about: '',
               }).then(() => {
                  const logoRef = ref(storage, `/${shopUrlName}/shop-logo`);
                  uploadBytes(logoRef, shopLogo!).then(() => {
                     getDownloadURL(logoRef).then(url => {
                        updateDoc(doc(database, 'shops', shopUrlName), {
                           logoUrl: url,
                        }).then(() => {
                           setShopName('');
                           setShopUrlName('');
                           setShopCategory('');
                           setShopOwnerName('');
                           setShopAddress('');
                           setShopLogo(null);

                           setLoading(false);
                           router.push(`/${shopUrlName}`).then(() => {
                              router.reload();
                           });
                        });
                     });
                  });
               });
            });
         }).catch((error) => {
            const errorCode = error.code;
            // const errorMessage = error.message;
            // ..
            console.error(`Signup Error (${errorCode})`);
            alert(`Signup Error : ${errorCode}`);

            setLoading(false);
         });
      } else if (!isShopUrlNameUnique) {
         alert('Shop Url Name must be unique');
      } else if (!(password.length >= 8)) {
         alert('Password must exceed 8 characters');
      } else if (!shopLogo) {
         alert('Please crop image');
      } else {
         setLoading(false);
         alert('Something went wrong. Please try again.');
      }
   };

   const handleFormReset = () => {
      setLoading(false);
      setShopName('');
      setShopCategory('');
      setShopOwnerName('');
      setShopAddress('');
      setShopUrlName('');
      setPassword('');
   };


   useEffect(() => {
      if (sessionStatus == 'unauthenticated') signInProvider('google', { callbackUrl: "/auth/signup" });

      session && onSnapshot(query(collection(database, 'shops'), where('providerID', '==', session.user.uid)), (snapshot) => {
         if (snapshot.docs.length === 1) {
            // #if there is an existing account
            snapshot.forEach(obj => {
               router.push(`/${obj.data().urlName}`);
            });
         } else {
            // #if there is no existing account
            setShopEmail(session.user.email!);
            setIsAccountNotExist(true);
         }
      });

      if (isAccountNotExist && (sessionStatus == 'authenticated')) {
         inputFocusRef.current.focus();
      }
   }, [session, sessionStatus, isAccountNotExist, router]);

   useEffect(() => {
      onSnapshot(query(collection(database, 'shops')), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         // console.log(!(shopDocIds.some(arr => arr == shopUrlName)));
         setIsShopUrlNameUnique(!(arr.some(arr => arr == shopUrlName)));
      });
   }, [shopUrlName]);

   useEffect(() => {
      dispatch(setAppPageId('createApp_page'));
   }, [dispatch]);


   return (
      <>
         <Head>
            <title>Create · Shopitect</title>
            <link rel="icon" type="image/png" href="/img/shopitect-logo.png" />
         </Head>

         {(isAccountNotExist && (sessionStatus == 'authenticated')) ? (
            <Box py={3} >
               <Container >
                  <Typography
                     fontSize={{ xs: '2rem', sm: '2.5rem' }}
                     component="h1"
                     textAlign="center"
                     sx={{ color: 'primary.dark' }}
                  >
                     Shopitect
                  </Typography>
                  <Typography variant="h5" component={'div'} gutterBottom>Create App</Typography>
                  <form onSubmit={handleFormSubmit}>
                     <Stack direction="column" spacing={3}>
                        <TextField
                           label="Shop Name"
                           size="small"
                           fullWidth
                           value={shopName}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopName(e.target.value)}
                           inputRef={inputFocusRef}
                           required
                        />
                        <TextField
                           label="Shop Url Name"
                           size="small"
                           fullWidth
                           helperText={(Boolean(shopUrlName) && !isFormSubmit) ?
                              (isShopUrlNameUnique ? 'Url is unique' : 'Url is not unique')
                              : '* This name is used in url for identifing your app. Make sure to enter a unique name'
                           }
                           value={shopUrlName}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopUrlName(e.target.value.split(" ").join("").toLowerCase())}
                           required
                           error={!isFormSubmit && !isShopUrlNameUnique}
                        />
                        <TextField
                           label="Shop Category"
                           size="small"
                           fullWidth
                           value={shopCategory}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopCategory(e.target.value)}
                           required
                        />
                        <TextField
                           label="Shop Ower Name"
                           size="small"
                           fullWidth
                           value={shopOwnerName}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopOwnerName(e.target.value)}
                           required
                        />
                        <TextField
                           label="Shop Address"
                           size="small"
                           multiline
                           minRows={3}
                           maxRows={5}
                           fullWidth
                           value={shopAddress}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopAddress(e.target.value)}
                           required
                        />
                        {session && (
                           <>
                              <TextField
                                 label="Email Address"
                                 size="small"
                                 fullWidth
                                 type="email"
                                 color="warning"
                                 defaultValue={session?.user.email}
                                 InputProps={{ readOnly: true }}
                              />
                              <TextField
                                 label="Password"
                                 size="small"
                                 fullWidth
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
                                 helperText="Password must exceed 8 characters"
                                 required
                              />
                           </>
                        )}
                        <Box>
                           <ImageCropper inputLabel="Shop Logo" getBlob={setShopLogo} />
                        </Box>
                     </Stack>

                     <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={{ xs: 2 }} pt={4}>
                        <Stack direction={{ xs: 'row' }} width="100%" spacing={{ xs: 2 }} >
                           <Button
                              variant="contained"
                              onClick={() => {
                                 router.push('/');
                              }}
                              size='medium'
                              fullWidth
                              color="error"
                           >cancel</Button>
                           <Button
                              variant="contained"
                              onClick={handleFormReset}
                              size='medium'
                              fullWidth
                              color="warning"
                           >reset</Button>
                        </Stack>
                        <LoadingButton
                           variant="contained"
                           type="submit"
                           size='medium'
                           fullWidth
                           loading={loading}
                           loadingPosition="start"
                           startIcon={<PublishRoundedIcon />}
                        >submit</LoadingButton>
                     </Stack>
                  </form>
               </Container>
            </Box>
         ) : (
            <Stack justifyContent="center" alignItems="center" pt={5} >
               <CircularProgress />
            </Stack>
         )}
      </>
   );
};

export default Create_app;

