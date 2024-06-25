// *Login confirm page
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import CancelIcon from "@mui/icons-material/Cancel";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../hooks";
import LoginIcon from "@mui/icons-material/Login";
import { LoadingButton } from "@mui/lab";
import CircleIcon from "@mui/icons-material/Circle";
import Link from "next/link";

const LoginConfirm = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const { data: user, status: userStatus } = useUser();

  const inputFocusRef = useRef<any>(null);

  const [email, setEmail] = useState(session ? session.user.email : "");
  const [password, setPassword] = useState("");

  const [authFailed, setAuthFailed] = useState(false);
  const [inputChange, setInputChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email!, password)
      .then(res => {
        setInputChange(false);
        setAuthFailed(false);
        setLoading(false);

        //  router.push(`/${shopUrlNameInput}`);
      })
      .catch(error => {
        setInputChange(false);
        setAuthFailed(true);
        setLoading(false);
      });
    //  }
  };

  useEffect(() => {
    user &&
      onSnapshot(
        query(collection(database, "shops"), where("accountID", "==", user.uid)),
        snapshot => {
          snapshot.forEach(obj => {
            // console.log(obj.data());
            if (userStatus === "authenticated") {
              router.push(`/${obj.data().urlName}`).then(() => {
                router.reload();
              });
            }
          });
        }
      );
  }, [router, user, userStatus]);

  useEffect(() => {
    setInputChange(true);
  }, [email, password]);

  useEffect(() => {
    userStatus === "unauthenticated" && inputFocusRef.current.focus();
  }, [userStatus]);

  return (
    <>
      <Head>
        <title>Login · Shopitect</title>
        <link rel='icon' type='image/png' href='/img/shopitect-logo.png' />
      </Head>

      {(userStatus === "unauthenticated" && (
        <>
          <Box height={"100vh"} display='flex' justifyContent='center' alignItems='center'>
            <Box px={3} py={8} borderRadius={1.5} sx={{ backgroundColor: "whitesmoke" }}>
              <Stack spacing={3} alignItems='center'>
                <Typography variant='h4' component='h1'>
                  Shopitect
                </Typography>
                <Typography variant='h5' component='div'>
                  Login
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label='Shop Email'
                      size='small'
                      color={inputChange ? "primary" : authFailed ? "error" : "success"}
                      type='email'
                      defaultValue={session ? session.user.email : ""}
                      inputRef={inputFocusRef}
                      onInput={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                    />
                    <TextField
                      label='Password'
                      size='small'
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onInput={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={() => setShowPassword(prev => !prev)}
                              edge='end'
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      color={inputChange ? "primary" : authFailed ? "error" : "success"}
                      required
                    />

                    {!inputChange && authFailed && (
                      <Typography variant='body2' component='p' sx={{ color: "red" }}>
                        * Wrong email or passward
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction='row' spacing={2} justifyContent='center' pt={2}>
                    <Link href={"/"} passHref>
                      <Button variant='contained' size='small' color='error'>
                        cancel
                      </Button>
                    </Link>

                    <LoadingButton
                      variant='contained'
                      size='small'
                      type='submit'
                      endIcon={
                        password === "" || inputChange ? (
                          <LoginIcon />
                        ) : authFailed ? (
                          <CancelIcon />
                        ) : (
                          <CircleIcon sx={{ color: "transparent" }} />
                        )
                      }
                      color={
                        password === "" || inputChange
                          ? "primary"
                          : authFailed
                            ? "error"
                            : "success"
                      }
                      disabled={email == "" || password === ""}
                      loading={loading}
                      loadingPosition='end'
                    >
                      login
                    </LoadingButton>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Box>
        </>
      )) ||
        ((userStatus === "loading" || userStatus === "authenticated") && (
          <Stack justifyContent='center' alignItems='center' pt={5}>
            <CircularProgress />
          </Stack>
        ))}
    </>
  );
};

export default LoginConfirm;
