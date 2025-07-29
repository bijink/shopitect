'use client';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LandingPageBtn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const via = searchParams.get('via');

  return (
    <div direction={'row'} spacing={2} pt={4}>
      <LoadingButton
        variant="contained"
        // color="primary"
        sx={{ bgcolor: '#1895e4', ':hover': { bgcolor: '#1da6ee' } }}
        size={'small'}
        // onClick={() => {
        //   if (!loading_login) {
        //     setLoading_signup(true);
        //     signOutAccount(auth).then(() => {
        //       signInProvider('google', {
        //         redirect: false,
        //         callbackUrl: `/auth/signup`,
        //       });
        //     });
        //   }
        // }}
        onClick={() => {
          router.push('/signup');
        }}
        loadingPosition="center"
        // loading={loading_signup}
        // disabled={userStatus === 'loading'}
      >
        signup
      </LoadingButton>
      <LoadingButton
        variant="contained"
        size="small"
        sx={{ bgcolor: '#f57a1f', ':hover': { bgcolor: '#f68a1d' } }}
        // sx={{
        //   bgcolor: userStatus === 'authenticated' ? colors.green[700] : colors.teal[600],
        //   '&:hover': {
        //     bgcolor: userStatus === 'authenticated' ? colors.green[800] : colors.teal[700],
        //   },
        // }}
        // onClick={() => {
        //   if (!loading_signup) {
        //     setLoading_login(true);
        //     via === 'recruiter'
        //       ? router.push(`/auth/login?via=recruiter`)
        //       : router.push(`/auth/login`);
        //   }
        // }}
        onClick={() => {
          router.push(via === 'recruiter' ? '/login?via=recruiter' : '/login');
        }}
        loadingPosition="center"
        // loading={loading_login}
        // disabled={userStatus === 'loading'}
      >
        login
      </LoadingButton>
    </div>
  );
}
