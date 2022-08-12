// *Login confirm page
import { useSession, signOut as signOutFromProvider, signIn as signInToProvider } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import UnAuthProvider from "../../components/unAuthProvider";
import { useUser } from "../../hooks";
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from "@mui/lab";
import CircleIcon from '@mui/icons-material/Circle';


const LoginConfirm = () => {
   const router = useRouter();

   const { data: session, status: sessionStatus } = useSession();
   // console.log(sessionStatus);
   const { data: user, status: userStatus } = useUser();
   // console.log(userStatus);

   const inputFocusRef = useRef<any>(null);

   const [shopUrlNameInput, setShopUrlNameInput] = useState('');
   const [password, setPassword] = useState('');

   const [isUrlConfirmed, setIsUrlConfirmed] = useState(false);
   const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
   const [inputChange, setInputChange] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);


   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      if (isUrlConfirmed && session) {
         signInWithEmailAndPassword(auth, session?.user.email!, password).then((userCredential) => {
            setInputChange(false);
            setIsPasswordConfirmed(true);
            setLoading(false);

            router.push(`/${shopUrlNameInput}`);
         }).catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;

            setInputChange(false);
            setIsPasswordConfirmed(false);
            setLoading(false);
         });
      }
   };


   useEffect(() => {
      user && onSnapshot(query(collection(database, 'shops'), where("accountID", "==", user.uid)), (snapshot) => {
         snapshot.forEach(obj => {
            // console.log(obj.data());
            if (userStatus === 'authenticated') {
               router.push(`/${obj.data().urlName}`).then(() => {
                  router.reload();
               });
            }
         });
      });
   }, [router, user, userStatus]);

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
   }, [shopUrlNameInput, session]);

   useEffect(() => {
      setInputChange(true);
   }, [password]);

   useEffect(() => {
      ((sessionStatus === 'authenticated') && (userStatus === 'unauthenticated')) && inputFocusRef.current.focus();
   }, [sessionStatus, userStatus]);


   return (
      <>
         <Head>
            <title>Login · Shopitect</title>
            <link rel="icon" type="image/png" href="/img/shopitect-logo.png" />
         </Head>

         {((sessionStatus === 'unauthenticated') && (
            <UnAuthProvider title="Login" />
         )) || (((sessionStatus === 'authenticated') && (userStatus === 'unauthenticated')) && (
            <>
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
                        <Typography variant="h4" component="h1">Shopitect</Typography>
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
                                 onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                    setShopUrlNameInput(e.target.value.split(" ").join("").toLowerCase());
                                 }}
                                 helperText={(shopUrlNameInput === '') ? "* Enter your Shop Url Name" : (isUrlConfirmed ? '' : "* You entered Url Name doesn't exist")}
                                 color={(shopUrlNameInput === '') ? "primary" : (isUrlConfirmed ? "success" : "error")}
                                 error={(shopUrlNameInput !== '') && !isUrlConfirmed}
                                 inputRef={inputFocusRef}
                                 required
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

                              <LoadingButton
                                 variant="contained"
                                 size="small"
                                 type="submit"
                                 endIcon={((password === '') || inputChange) ? <LoginIcon /> : (isPasswordConfirmed ? <CircleIcon sx={{ color: 'transparent' }} /> : <CancelIcon />)}
                                 color={((password === '') || inputChange) ? 'primary' : (isPasswordConfirmed ? 'success' : 'error')}
                                 disabled={password === ''}
                                 loading={loading}
                                 loadingPosition="end"
                              >login</LoadingButton>
                           </Stack>
                        </form>
                     </Stack>
                  </Box>
               </Box>
            </>
         )) || (((sessionStatus === 'loading') || (userStatus === 'loading') || (userStatus === 'authenticated')) && (
            <Stack justifyContent="center" alignItems="center" pt={5} >
               <CircularProgress />
            </Stack>
         ))}
      </>
   );
};

export default LoginConfirm;
