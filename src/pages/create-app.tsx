import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { database, auth } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useRouter } from "next/router";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from "firebase/auth";

declare const window: Window &
   typeof globalThis & {
      recaptchaVerifier: any;
      confirmationResult: any;
   };
const Create_app = () => {
   const router = useRouter();

   const inputFocusRef = useRef<any>(null);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopEmail, setShopEmail] = useState('');
   const [shopAddress, setShopAddress] = useState('');

   const [loading, setLoading] = useState(false);


   const setUpRecaptcha = () => {
      // const auth = getAuth();
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
         'size': 'invisible',
         'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('captcha resolved:', response);
            // onSignInSubmit();
         }
      }, auth);
   };

   const addShopDetails = async (shop: any) => {
      // e.preventDefault();
      setLoading(true);

      const docRef = await addDoc(collection(database, 'shops'), {
         shopId: shop.uid,
         shopName,
         shopCategory,
         shopOwnerName,
         shopEmail,
         shopAddress,
         createdAt: serverTimestamp()
      });

      await updateDoc(doc(database, 'shops', docRef.id), {
         docId: docRef.id
      }).then(() => {
         setShopName('');
         setShopCategory('');
         setShopOwnerName('');
         setShopEmail('');
         setShopAddress('');
      }).then(() => {
         setLoading(false);
         router.push('/shop-name');
      });
   };

   const onSignInSubmit = (e: any) => {
      e.preventDefault();
      // setLoading(true);
      setUpRecaptcha();

      // const phoneNumber = getPhoneNumberFromUserInput();
      const phoneNumber = "+911234567890";
      console.log(phoneNumber);
      const appVerifier = window.recaptchaVerifier;

      // const auth = getAuth();
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
         .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
            // const code = getCodeFromUserInput();
            const code = window.prompt("Enter OTP");
            confirmationResult.confirm(code!).then((result) => {
               // User signed in successfully.
               const shop = result.user;
               // ...
               // console.log('user is signed in');
               // console.log('user is signed in:', user);
               console.log('user is signed in:', shop);
               // 
               // updateProfile(auth.currentUser, { displayName: shopOwnerName }).then(() => {
               updateProfile(shop.auth.currentUser, { displayName: shopName }).then(() => {
                  addShopDetails(shop);
               });
               // 
            }).catch((error) => {
               // User couldn't sign in (bad verification code?)
               // ...
               console.log('sign in failed');
            });
         }).catch((error) => {
            // Error; SMS not sent
            // ...
         });
   };

   const handleFormReset = () => {
      setShopName('');
      setShopCategory('');
      setShopOwnerName('');
      setShopEmail('');
      setShopAddress('');
   };


   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);


   return (
      <Box py={10} >
         <Container >
            <Typography variant="h4" component={'div'} gutterBottom>Create App</Typography>
            {/* <form onSubmit={handleFormSubmit}> */}
            <form onSubmit={onSignInSubmit}>
               <div id="recaptcha-container"></div>
               <Stack direction="column" spacing={3}>
                  <Stack direction="row" spacing={3} >
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
                        label="Shop Category"
                        size="small"
                        fullWidth
                        value={shopCategory}
                        onInput={(e: any) => setShopCategory(e.target.value)}
                        required
                     />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                     <TextField
                        label="Shop Ower Name"
                        size="small"
                        fullWidth
                        value={shopOwnerName}
                        onInput={(e: any) => setShopOwnerName(e.target.value)}
                        required
                     />
                     <TextField
                        label="Email Address"
                        size="small"
                        fullWidth
                        type="email"
                        value={shopEmail}
                        onInput={(e: any) => setShopEmail(e.target.value)}
                        required
                     />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                     <TextareaAutosize
                        aria-label="shop address"
                        placeholder="Shop Address"
                        minRows={8}
                        maxRows={8}
                        style={{
                           minWidth: '49%',
                           maxWidth: '49%',
                           fontSize: '15px',
                           padding: '12px',
                           borderRadius: '4px',
                           outlineColor: '#1976d2'
                        }}
                        value={shopAddress}
                        onInput={(e: any) => setShopAddress(e.target.value)}
                        required
                     />
                  </Stack>
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
