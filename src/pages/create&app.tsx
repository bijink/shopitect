import type { NextPage } from "next";

import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Container, IconButton, InputAdornment, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { ChangeEvent, FormEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { database, auth } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useRouter } from "next/router";
import { signOut as signOutProvider, signIn as signInProvider, useSession } from "next-auth/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Head from "next/head";
import { setAppPageId } from "../redux/slices/pageId.slice";
import { useAppDispatch } from "../redux/hooks";


const Create_app: NextPage = () => {
   const router = useRouter();

   const dispatch = useAppDispatch();

   const { data: session, status: sessionStatus } = useSession();
   // console.log(session?.user);

   const inputFocusRef = useRef<any>(null);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopEmail, setShopEmail] = useState('');
   const [shopAddress, setShopAddress] = useState('');
   const [shopUrlName, setShopUrlName] = useState('');
   const [password, setPassword] = useState('');

   const [loading, setLoading] = useState(false);
   const [shopDocIds, setShopDocIds] = useState([] as Array<string>);
   const [isShopUrlNameUnique, setIsShopUrlNameUnique] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [isAccountNotExist, setIsAccountNotExist] = useState(false);


   const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      // #shopUrlName is used as documentID in firebase firestore as a unique id
      if (session && isShopUrlNameUnique && (password.length >= 8)) {
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
                  about: '',
                  // # providerID means 'Google auth user uid (integrated using firebase and nextAuth)'
                  providerID: session?.user.uid,
                  // # accountID means 'firebase auth user uid'
                  accountID: auth.currentUser?.uid,
                  createdAt: serverTimestamp(),
               }).then(() => {
                  setShopName('');
                  setShopUrlName('');
                  setShopCategory('');
                  setShopOwnerName('');
                  setShopAddress('');

                  setLoading(false);
                  router.push(`/${shopUrlName}`).then(() => {
                     router.reload();
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
      } else {
         setLoading(false);
         alert('Please enter all fields correctly');
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
   }, [session, sessionStatus]);

   useEffect(() => {
      onSnapshot(query(collection(database, 'shops')), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         setShopDocIds(arr);
      });

      // console.log(!(shopDocIds.some(arr => arr == shopUrlName)));
      setIsShopUrlNameUnique(!(shopDocIds.some(arr => arr == shopUrlName)));
   }, [shopUrlName]);

   useEffect(() => {
      dispatch(setAppPageId('createApp_page'));
   }, []);


   return (
      <>
         <Head>
            <title>Create (app) · Shopitect</title>
            <meta name="description" content="An architect of shop management application" />
            <meta property="og:title" content="Shopitect" key="title" />
         </Head>

         {(isAccountNotExist && (sessionStatus == 'authenticated')) ? (
            <Box py={3} >
               <Container >
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
                           helperText={!(shopUrlName !== '') ?
                              '* This name is used in url for identifing your app. Make sure to enter a unique name'
                              : (isShopUrlNameUnique ? 'Url is unique' : 'Url is not unique')
                           }
                           value={shopUrlName}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setShopUrlName(e.target.value.split(" ").join("").toLowerCase())}
                           required
                           error={!isShopUrlNameUnique}
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
                        <TextareaAutosize
                           aria-label="shop address"
                           placeholder="Shop Address*"
                           minRows={5}
                           maxRows={5}
                           style={{
                              // minWidth: '49%',
                              // maxWidth: '49%',
                              fontSize: '15px',
                              padding: '12px',
                              borderRadius: '4px',
                              borderColor: 'lightgray',
                              outlineColor: '#1976d2',
                           }}
                           value={shopAddress}
                           onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setShopAddress(e.target.value)}
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
                                 required
                              />
                           </>
                        )}
                     </Stack>
                     <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} pt={4}>
                        <Button
                           variant="contained"
                           onClick={() => {
                              router.push('/');
                           }}
                           size='large'
                           fullWidth
                           color="error"
                        >cancel</Button>
                        <Button
                           variant="contained"
                           onClick={handleFormReset}
                           size='large'
                           fullWidth
                           color="warning"
                        >reset</Button>
                        <LoadingButton
                           variant="contained"
                           type="submit"
                           size='large'
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

