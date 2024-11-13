'use client';
import { useUser } from '@/hooks';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import PageLogo from '../../../../public/image/shopitect-logo_180x180.png';

export default function Page() {
  const searchParams = useSearchParams();
  const via = searchParams.get('via');
  const viaRecruiterKey = process.env.viaRecruiterKeys?.split('/') as string[];
  const inputFocusRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, status: userStatus } = useUser();

  const getShop = async () => {
    const a = await fetch('/api/shop?id=H1hkPSmMwWa0pwjrCSm7GVKEJJD2').then((res) => res.json());
    const b = await fetch('/api/shop?name=my-shop').then((res) => res.json());
    console.log({ a, b });
  };
  useEffect(() => {
    inputFocusRef.current?.focus();
    getShop();
  }, []);
  useEffect(() => {
    console.log(user);

    // user &&
    //   onSnapshot(
    //     query(collection(database, 'shops'), where('accountID', '==', user.uid)),
    //     (snapshot) => {
    //       snapshot.forEach((obj) => {
    //         // console.log(obj.data());
    //         if (userStatus === 'authenticated') {
    //           router.push(`/${obj.data().urlName}`).then(() => {
    //             router.reload();
    //           });
    //         }
    //       });
    //     },
    //   );
  }, [user, userStatus]);

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   signInWithEmailAndPassword(auth, email!, password)
  //     .then((res) => {
  //       setInputChange(false);
  //       setAuthFailed(false);
  //       setLoading(false);
  //       //  router.push(`/${shopUrlNameInput}`);
  //     })
  //     .catch((error) => {
  //       setInputChange(false);
  //       setAuthFailed(true);
  //       setLoading(false);
  //     });
  // };

  const form = useForm({
    defaultValues: {
      email: via === 'recruiter' ? viaRecruiterKey[0] : '',
      password: via === 'recruiter' ? viaRecruiterKey[1] : '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      try {
        // const res = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   body: JSON.stringify(value),
        // }).then((res) => res.json());
        // console.log('res:: ', res);
        // await signIn('credentials', {
        //   username: inputs.username,
        //   password: inputs.password,
        //   callbackUrl: '/',
        // });
        signIn('google', {
          redirect: false,
          // callbackUrl: `/auth/signup`,
        });
      } catch (error) {
        console.log('err:: ', error);
      }
    },
  });

  return (
    <Box height={'100vh'} display="flex" justifyContent="center" alignItems="center">
      <Box px={3} py={8} borderRadius={1.5}>
        <Stack spacing={3} alignItems="center">
          <Image alt="shopitect-logo" src={PageLogo} width={100} height={100} />
          <Typography variant="h5" component="div">
            Login
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Stack spacing={2}>
              <form.Field name="email">
                {(field) => (
                  <TextField
                    label="Email"
                    size="small"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    inputRef={inputFocusRef}
                    required
                  />
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <TextField
                    label="Password"
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </form.Field>
              {/* {!inputChange && authFailed && (
                  <Typography variant="body2" component="p" sx={{ color: 'red' }}>
                    * Wrong email or passward
                  </Typography>
                )} */}
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center" pt={5}>
              <Link href={via === 'recruiter' ? '/?via=recruiter ' : '/'} passHref>
                <Button variant="contained" size="small" color="error">
                  cancel
                </Button>
              </Link>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <LoadingButton
                    variant="contained"
                    size="small"
                    type="submit"
                    loadingPosition="end"
                    // endIcon={
                    //   password === '' || inputChange ? (
                    //     <LoginIcon />
                    //   ) : authFailed ? (
                    //     <CancelIcon />
                    //   ) : (
                    //     <CircleIcon sx={{ color: 'transparent' }} />
                    //   )
                    // }
                    // color={
                    //   password === '' || inputChange ? 'primary' : authFailed ? 'error' : 'success'
                    // }
                    // disabled={email == '' || password === ''}
                    disabled={!canSubmit}
                    loading={isSubmitting}
                  >
                    login
                  </LoadingButton>
                )}
              </form.Subscribe>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
}
