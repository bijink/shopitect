import type { GetServerSideProps, NextPage } from "next";
import type { GoogleProviderTypes } from "../signin.types";

import { getProviders, signIn as signInToProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { database } from "../../../config/firebase.config";


const SignIn: NextPage<GoogleProviderTypes> = ({ providers }) => {
   const router = useRouter();
   const { isApp, url } = router.query;
   // console.log(isApp);
   // console.log(url);


   // const { data: session } = useSession();
   // console.log(session?.user.uid);

   const inputFocusRef = useRef<any>(null);

   const [shopDocIds, setShopDocIds] = useState([] as Array<string>);
   const [isShopUrlName, setIsShopUrlName] = useState(false);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [shopEmailInput, setShopEmailInput] = useState('');

   // const [shopUrlNameWithSession, setShopUrlNameWithSession] = useState('');
   // const [hasComfirm, setHasComfirm] = useState(false);
   const [isConfirmed, setIsConfirmed] = useState(false);
   // console.log(isConfirmed);
   // const [loading, setLoading] = useState(false);


   useEffect(() => {
      if (shopUrlNameInput !== '') {
         getDoc(doc(database, 'shops', shopUrlNameInput)).then((snap) => {
            // console.log(snap.data());
            if ((shopUrlNameInput == snap.data()?.shopUrlName) && (shopEmailInput == snap.data()?.shopEmail)) {
               setIsConfirmed(true);
            } else {
               setIsConfirmed(false);
            }
         });
      }
   }, [shopUrlNameInput, shopEmailInput]);


   useEffect(() => {
      onSnapshot(collection(database, 'shops'), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         setShopDocIds(arr);
      });

      // console.log((shopDocId.some(arr => arr == shopUrlNameInput)));
      setIsShopUrlName((shopDocIds.some(arr => arr == shopUrlNameInput)));
   }, [shopUrlNameInput]);

   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);



   return (
      <>
         <Head>
            <title>Sign In - master-project</title>
         </Head>

         <Box
            height={'100vh'}
            display="flex" justifyContent="center" alignItems="center"
         >
            <Box
               px={3} py={8}
               borderRadius={1.5}
               sx={{ backgroundColor: 'whitesmoke' }}
            >
               {/* <form onSubmit={handleSubmit}> */}
               <Stack spacing={3} alignItems="center">
                  <Typography variant="h4" component="h1" >My Master Project Name</Typography>
                  <Typography variant="h5" component="div">Sign In</Typography>

                  <Stack spacing={2}>
                     <TextField
                        label="Your Shop Url Name"
                        size="small"
                        type='text'
                        value={shopUrlNameInput}
                        onChange={(e: any) => {
                           setShopUrlNameInput(e.target.value.split(" ").join("").toLowerCase());
                        }}
                        helperText={(shopUrlNameInput === '') ? "* Enter your Shop Url Name" : (!isShopUrlName && "* You entered Url Name doesn't exist")}
                        color={(shopUrlNameInput === '') ? 'primary' : (isShopUrlName ? 'success' : 'error')}
                        required
                        inputRef={inputFocusRef}
                     />
                     <TextField
                        label="Your Shop Email"
                        size="small"
                        type='email'
                        value={shopEmailInput}
                        onChange={(e: any) => {
                           setShopEmailInput(e.target.value);
                        }}
                        color={(shopEmailInput === '') ? 'primary' : (isConfirmed ? 'success' : 'error')}
                        required
                     />
                  </Stack>

                  <Box >
                     {Object.values(providers).map((provider) => (
                        <Box key={provider.name}>
                           <Button
                              variant="contained"
                              disabled={!isConfirmed}
                              color={isConfirmed ? 'success' : 'primary'}
                              onClick={() => {
                                 // signInToProvider(provider.id, { callbackUrl: isApp ? `/${shopUrlNameInput}` : '/create-app' });
                                 // isConfirmed && signInToProvider(provider.id, { callbackUrl: '/auth/signin' });
                                 // isConfirmed && signInToProvider(provider.id, { callbackUrl: `/${shopUrlNameInput}` });
                                 isConfirmed && signInToProvider(provider.id, { callbackUrl: `/auth/signin/confirm?url=${shopUrlNameInput}` });
                              }}
                           >
                              Sign in with {provider.name}
                           </Button>
                        </Box>
                     ))}
                  </Box>
               </Stack>
               {/* </form> */}
            </Box>
         </Box>
      </>
   );
};


export const getServerSideProps: GetServerSideProps = async () => {
   const providers = await getProviders();

   return { props: { providers } };
};

export default SignIn;
