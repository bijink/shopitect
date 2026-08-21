'use client'

import Link from 'next/link'

export default function LandingPageBtn() {
  return (
    <div className="flex space-x-2 pt-4">
      <Link
        href="/signup"
        className="w-fit h-fit py-1 px-2.5 text-white bg-[#1895e4] hover:bg-[#1da6ee] cursor-pointer rounded-md"
        onNavigate={() => {
          console.log('Navigating...')
        }}
      >
        Signup
      </Link>
      <Link
        href="/signin"
        className="w-fit h-fit py-1 px-2.5 text-white bg-[#f57a1f] hover:bg-[#f68a1d] cursor-pointer rounded-md"
        onNavigate={() => {
          console.log('Navigating...')
        }}
      >
        Signin
      </Link>

      {/* <button
        className="bg-[#1895e4] hover:bg-[#1da6ee]"
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
          router.push('/signup')
        }}
        // loading={loading_signup}
        // disabled={userStatus === 'loading'}
      >
        signup
      </button> */}
      {/* <button
        className="bg-[#f57a1f] hover:bg-[#f68a1d]"
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
          router.push(via === 'recruiter' ? '/login?via=recruiter' : '/login')
        }}
        // loading={loading_login}
        // disabled={userStatus === 'loading'}
      >
        login
      </button> */}
    </div>
  )
}
