'use client';
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
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useUser } from '@/hooks';

interface FormInput {
  shopnameOrEmail: string;
  password: string;
}
export default function Page() {
  const searchParams = useSearchParams();
  const via = searchParams.get('via');
  const viaRecruiterKey = process.env.viaRecruiterKeys?.split('/') as string[];
  // const inputFocusRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, status: userStatus } = useUser();

  // const getShop = async () => {
  //   const a = await fetch('/api/shop?id=H1hkPSmMwWa0pwjrCSm7GVKEJJD2').then((res) => res?.json());
  //   const b = await fetch('/api/shop?name=my-shop').then((res) => res?.json());
  //   console.log({ a, b });
  // };
  // const getShops = async () => {
  //   const c = await fetch('/api/shop').then((res) => res);
  //   console.log({ c });
  // };
  // useEffect(() => {
  //   inputFocusRef.current?.focus();
  // }, []);
  useEffect(() => {
    // console.log(user);
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

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<FormInput>({
    defaultValues: {
      shopnameOrEmail: via === 'recruiter' ? viaRecruiterKey[0] : '',
      password: via === 'recruiter' ? viaRecruiterKey[1] : '',
    },
  });
  // useEffect(() => {
  //   setFocus('shopnameOrEmail');
  // }, [setFocus]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log(data);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json());
      console.log('res:: ', res);

      // await signIn('credentials', {
      //   username: data.email,
      //   password: data.password,
      //   callbackUrl: '/',
      // });
      // signIn('google', {
      //   redirect: false,
      //   // callbackUrl: `/auth/signup`,
      // });
    } catch (error) {
      console.log('err:: ', error);
    }
  };
  return (
    <Box height={'100vh'} display="flex" justifyContent="center" alignItems="center">
      <Box px={3} py={8} borderRadius={1.5}>
        <Stack spacing={3} alignItems="center">
          <Image
            alt="shopitect-logo"
            src="/image/shopitect-logo_180x180.png"
            priority
            width={100}
            height={100}
          />
          <Typography variant="h5" component="div">
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="shopnameOrEmail"
                control={control}
                render={({ field }) => (
                  <TextField label="Shopname or Email" variant="outlined" size="small" {...field} />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    variant="outlined"
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    // slotProps={{ inputLabel: { shrink: true } }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              size="small"
                              sx={{
                                visibility: getValues('password') ? 'visible' : 'hidden',
                              }}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" pt={5}>
              <Link href={via === 'recruiter' ? '/?via=recruiter ' : '/'} passHref>
                <Button variant="contained" size="small" color="error">
                  cancel
                </Button>
              </Link>
              <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting}>
                login
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
}
