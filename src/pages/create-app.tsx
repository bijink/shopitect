import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { database, auth } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useRouter } from "next/router";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from "firebase/auth";
import { useSession } from "next-auth/react";

declare const window: Window &
   typeof globalThis & {
      recaptchaVerifier: any;
      confirmationResult: any;
   };
const Create_app = () => {
   const router = useRouter();

   const { data: session } = useSession();

   const inputFocusRef = useRef<any>(null);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopEmail, setShopEmail] = useState('');
   const [shopAddress, setShopAddress] = useState('');
   // const [password, setPassword] = useState('');
   const [shopUrlName, setShopUrlName] = useState('');

   const [loading, setLoading] = useState(false);


   const handleFormSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      // 
      // onSnapshot(query(collection(database, 'shops'), where('shopId', '==', session?.user.uid)), (snapshot) => {
      //    // snapshot.forEach(obj => {
      //    //    // setShopDetails(obj.data());
      //    //    console.log('obj:', obj.data());
      //    // });
      //    console.log(snapshot.docs);
      // });
      //

      // const docRef = await addDoc(collection(database, 'shops', shopUrlName), {
      //    shopId: session?.user.uid,
      //    shopName,
      //    shopCategory,
      //    shopOwnerName,
      //    shopEmail,
      //    shopAddress,
      //    shopUrlName,
      //    createdAt: serverTimestamp()
      // });

      // const docRef = await setDoc(doc(database, 'shops', shopUrlName), {
      // *shopUrlName is used as documentID for uniqueness of each shopApps
      // *shopUrlName is used to identify the shopApp
      await setDoc(doc(database, 'shops', shopUrlName), {
         shopName,
         shopUrlName,
         shopCategory,
         shopEmail,
         shopAddress,
         shopOwnerName,
         shopAuthId: session?.user.uid,
         createdAt: serverTimestamp()
      }).then(() => {
         setLoading(false);
         // router.push(`/${session?.user.uid}`);
      });

      // await updateDoc(doc(database, 'shops', docRef.id), {
      //    docId: docRef.id
      // }).then(() => {
      //    setShopName('');
      //    setShopCategory('');
      //    setShopOwnerName('');
      //    setShopEmail('');
      //    setShopAddress('');
      //    setShopUrlName('');
      // }).then(() => {
      //    setLoading(false);
      //    // router.push(`/${session?.user.uid}`);
      // });
   };

   const handleFormReset = () => {
      setShopName('');
      setShopCategory('');
      setShopOwnerName('');
      // setShopEmail('');
      setShopAddress('');
      setShopUrlName('');
   };



   useEffect(() => {

   }, [session]);

   useEffect(() => {
      inputFocusRef.current.focus();

      setShopEmail(session?.user.email!);
      // console.log(session?.user);
      // console.log(session);

      session && (
         onSnapshot(query(collection(database, 'shops'), where('shopId', '==', session?.user.uid)), (snapshot) => {
            // console.log(snapshot.docs);
            if (snapshot.docs.length > 0) {
               // router.push(`/${session?.user.uid}`);
               // console.log(snapshot.docs);

               // router.push(`/${session?.user.uid}`);
            }
         })
      );
   }, [session]);

   // const [datas, setDatas] = useState([]);

   useEffect(() => {
      onSnapshot(query(collection(database, 'shops')), (snapshot) => {
         snapshot.forEach(obj => {
            console.log(obj.id);
            // console.log(obj.data());
            // console.log(obj.data().shopName);
            // setDatas(obj.data().shopName);

         });
         // console.log(snapshot.docs);

      });
      // }, [shopUrlName]);

   }, []);

   // useEffect(() => {
   //    console.log(datas);

   // }, [datas]);


   return (
      <Box py={10} >
         <Container >
            <Typography variant="h4" component={'div'} gutterBottom>Create App</Typography>
            <form onSubmit={handleFormSubmit}>
               {/* <form onSubmit={onSignInSubmit}> */}
               <div id="recaptcha-container"></div>
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
                     helperText="* This name is used in url for identifing your app. Make sure to enter a unique name"
                     value={shopUrlName}
                     onInput={(e: any) => setShopUrlName(e.target.value)}
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
                        minWidth: '49%',
                        maxWidth: '49%',
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
                     <TextField
                        label="Email Address"
                        size="small"
                        fullWidth
                        type="email"
                        defaultValue={session?.user.email}
                        // value={shopEmail}
                        // onInput={(e: any) => setShopEmail(e.target.value)}
                        // required
                        InputProps={{ readOnly: true }}
                     />
                  )}
                  {/* <TextField
                        label="Password"
                        size="small"
                        fullWidth
                        type="password"
                        value={password}
                        onInput={(e: any) => setPassword(e.target.value)}
                        required
                     /> */}
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
