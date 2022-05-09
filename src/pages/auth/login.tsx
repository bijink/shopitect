// *Login confirm page
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const LoginConfirm = () => {
   const router = useRouter();

   const { data: session } = useSession();

   const inputFocusRef = useRef<any>(null);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [isConfirmed, setIsConfirmed] = useState(false);
   const [delayOver, setDelayOver] = useState(false);
   const [inputChange, setInputChange] = useState(false);


   const handleSubmit = (e: any) => {
      e.preventDefault();
      inputFocusRef.current.focus();

      onSnapshot(query(collection(database, 'shops'), where("shopEmail", "==", session?.user.email)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data().shopUrlName);
            if (shopUrlNameInput === obj.data().shopUrlName) {
               setIsConfirmed(true);
               router.push(`/${obj.data().shopUrlName}`);
            } else {
               setIsConfirmed(false);
            }
            setInputChange(false);
            setDelayOver(true);
         });
      });
   };


   useEffect(() => {
      setInputChange(true);
   }, [shopUrlNameInput]);

   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);


   return (
      <>
         <Head>
            <title>Login - master-project</title>
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
               <Stack spacing={3} alignItems="center">
                  <Typography variant="h4" component="h1">My Master Project Name</Typography>
                  <Typography variant="h5" component="div">Login Confirm</Typography>
                  <form onSubmit={handleSubmit}>
                     <Stack spacing={2}>
                        {session &&
                           <TextField
                              label="Your Shop Email"
                              size="small"
                              color="warning"
                              type='email'
                              defaultValue={session.user.email}
                              InputProps={{ readOnly: true }}
                              required
                           />
                        }
                        <TextField
                           label="Your Shop Url Name"
                           size="small"
                           type='text'
                           value={shopUrlNameInput}
                           onInput={(e: any) => {
                              setShopUrlNameInput(e.target.value.split(" ").join("").toLowerCase());
                           }}
                           helperText={(inputChange || isConfirmed) ? "* Enter your Shop Url Name" : ((delayOver && !isConfirmed) && "* You entered Url Name is not correct")}
                           required
                           inputRef={inputFocusRef}
                        />
                     </Stack>
                     <Stack direction="row" justifyContent="center" pt={2}>
                        <Button
                           variant="contained"
                           size="small"
                           type="submit"
                           endIcon={inputChange ? '' : (isConfirmed ? <CheckCircleIcon /> : <CancelIcon />)}
                           color={inputChange ? 'primary' : (isConfirmed ? 'success' : 'error')}
                        >
                           confirm
                        </Button>
                     </Stack>
                  </form>
               </Stack>
            </Box>
         </Box>
      </>
   );
};

export default LoginConfirm;
