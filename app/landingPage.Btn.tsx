"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LandingPageBtn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const via = searchParams.get("via");

  return (
    <div className="flex space-x-2 pt-4">
      <button
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
          router.push("/signup");
        }}
        // loading={loading_signup}
        // disabled={userStatus === 'loading'}
      >
        signup
      </button>
      <button
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
          router.push(via === "recruiter" ? "/login?via=recruiter" : "/login");
        }}
        // loading={loading_login}
        // disabled={userStatus === 'loading'}
      >
        login
      </button>
    </div>
  );
}
