// *Login confirm page
import { useSession, signOut as signOutFromProvider, signIn as signInToProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginConfirm = () => {
   const router = useRouter();

   const { data: session, status } = useSession();
   // console.log('session:', session, '; ', 'status:', status);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [password, setPassword] = useState('');

   const [isUrlConfirmed, setIsUrlConfirmed] = useState(false);
   const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
   const [inputChange, setInputChange] = useState(false);
   const [showPassword, setShowPassword] = useState(false);


   const handleSubmit = (e: any) => {
      e.preventDefault();

      if (isUrlConfirmed && session) {
         signInWithEmailAndPassword(auth, session?.user.email!, password).then((userCredential) => {
            setInputChange(false);
            setIsPasswordConfirmed(true);

            // console.log('passed');
            router.push(`/${shopUrlNameInput}`);
         }).catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log(errorCode, ' : ', errorMessage);
            // console.log('catch');

            setInputChange(false);
            setIsPasswordConfirmed(false);
         });
      }
   };


   useEffect(() => {
      session && onSnapshot(query(collection(database, 'shops'), where("shopEmail", "==", session?.user.email)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data().shopUrlName);
            if (shopUrlNameInput === obj.data().shopUrlName) {
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


   if (status == 'loading') return (<Head><title>Login - master-project</title></Head>);
   else if (status == 'unauthenticated') return (
      <>
         <Head><title>Login - master-project</title></Head>
         <h2>You didn't selected your google account</h2>
         <Button variant="contained" size='small' color="error" onClick={() => {
            // signOutFromProvider({ redirect: false, callbackUrl: "/" });
            signOutFromProvider({ callbackUrl: "/" });
         }}>go back</Button>
         <Button variant="contained" size='small' color="primary" onClick={() => {
            signInToProvider();
         }}>select</Button>
      </>
   );
   else if (status == 'authenticated') return (
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
                  <Typography variant="h5" component="div">Login</Typography>
                  <form onSubmit={handleSubmit}>
                     <Stack spacing={2}>
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
                     <Stack direction="row" spacing={2} justifyContent="center" pt={2}>
                        <Button variant="contained" size='small' color="error" onClick={() => {
                           signOutFromProvider({ callbackUrl: "/" });
                        }}>cancel</Button>
                        <Button
                           variant="contained"
                           size="small"
                           type="submit"
                           endIcon={((password === '') || inputChange) ? '' : (isPasswordConfirmed ? <CheckCircleIcon /> : <CancelIcon />)}
                           color={((password === '') || inputChange) ? 'primary' : (isPasswordConfirmed ? 'success' : 'error')}
                           disabled={password === ''}
                        >
                           login
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
