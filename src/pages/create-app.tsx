import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, IconButton, InputAdornment, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { database, auth } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


const Create_app = () => {
   const router = useRouter();

   // console.log(auth.currentUser);

   const { data: session } = useSession();
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
   const [shopDocId, setShopDocId] = useState([] as Array<string>);
   const [isShopUrlNameUnique, setIsShopUrlNameUnique] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   // used to disable submit button
   const [isAccountNotExist, setIsAccountNotExist] = useState(false);


   const handleFormSubmit = (e: any) => {
      e.preventDefault();
      setLoading(true);

      // *shopUrlName is used as documentID in firebase firestore as a unique id
      if (session && isShopUrlNameUnique && (password.length >= 8)) {
         createUserWithEmailAndPassword(auth, shopEmail, password).then((userCredential) => {
            // Signed in 
            // const user = userCredential.user;
            // ...
            updateProfile(auth.currentUser!, { displayName: shopUrlName, photoURL: session.user.image }).then(() => {
               // console.log(auth.currentUser);
               setDoc(doc(database, 'shops', shopUrlName), {
                  shopName,
                  shopUrlName,
                  shopCategory,
                  shopOwnerName,
                  shopAddress,
                  shopEmail,
                  // shopGoogleAuthId means 'Google auth user uid (integrated using firebase and nextAuth)'
                  shopGoogleAuthId: session?.user.uid,
                  // shopId means 'firebase auth user uid'
                  shopId: auth.currentUser?.uid,
                  createdAt: new Date(new Date().getTime()).toString(),
               }).then(() => {
                  setShopName('');
                  setShopUrlName('');
                  setShopCategory('');
                  setShopOwnerName('');
                  setShopAddress('');

                  setLoading(false);
                  router.push(`/${shopUrlName}`);
               });
            });
         }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            console.log(errorCode, ' : ', errorMessage);
         });
      } else {
         setLoading(false);
         alert('Please enter all fields correctly');
      }
   };

   const handleFormReset = () => {
      setShopName('');
      setShopCategory('');
      setShopOwnerName('');
      setShopAddress('');
      setShopUrlName('');
   };


   useEffect(() => {
      inputFocusRef.current.focus();
      setShopEmail(session?.user.email!);

      session && (
         onSnapshot(query(collection(database, 'shops'), where('shopGoogleAuthId', '==', session?.user.uid)), (snapshot) => {
            let shopUrlNameRoute;
            snapshot.forEach(obj => {
               // console.log(obj.data().shopUrlName);
               shopUrlNameRoute = obj.data().shopUrlName;
            });

            if (snapshot.docs.length > 0) {
               router.push(`/${shopUrlNameRoute}`);
            } else {
               setIsAccountNotExist(true);
            }
         })
      );
   }, [session]);

   useEffect(() => {
      onSnapshot(query(collection(database, 'shops')), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         setShopDocId(arr);
      });

      // console.log(!(shopDocId.some(arr => arr == shopUrlName)));
      setIsShopUrlNameUnique(!(shopDocId.some(arr => arr == shopUrlName)));
   }, [shopUrlName]);


   return (
      <Box py={10} >
         <Container >
            <Typography variant="h4" component={'div'} gutterBottom>Create App</Typography>
            <form onSubmit={handleFormSubmit}>
               <Stack direction="column" spacing={3}>
                  <TextField
                     label="Shop Name"
                     size="small"
                     fullWidth
                     value={shopName}
                     onInput={(e: any) => setShopName(e.target.value)}
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
                     onInput={(e: any) => setShopUrlName(e.target.value.split(" ").join("").toLowerCase())}
                     required
                     error={!isShopUrlNameUnique}
                  />
                  <TextField
                     label="Shop Category"
                     size="small"
                     fullWidth
                     value={shopCategory}
                     onInput={(e: any) => setShopCategory(e.target.value)}
                     required
                  />
                  <TextField
                     label="Shop Ower Name"
                     size="small"
                     fullWidth
                     value={shopOwnerName}
                     onInput={(e: any) => setShopOwnerName(e.target.value)}
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
                     onInput={(e: any) => setShopAddress(e.target.value)}
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
                           required
                        />
                     </>
                  )}
               </Stack>
               <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} pt={4}>
                  <Button
                     variant="contained"
                     onClick={handleFormReset}
                     size='large'
                     fullWidth
                     color="error"
                  >Reset</Button>
                  <LoadingButton
                     variant="contained"
                     type="submit"
                     size='large'
                     fullWidth
                     disabled={!isAccountNotExist}
                     loading={loading}
                     loadingPosition="start"
                     startIcon={<PublishRoundedIcon />}
                  >Submit</LoadingButton>
               </Stack>
            </form>
         </Container>
      </Box>
   );
};

export default Create_app;
