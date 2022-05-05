import type { GetServerSideProps, NextPage } from "next";
import type { GoogleProviderTypes } from "./signin.types";

import { getProviders, signIn as signInToProvider } from "next-auth/react";
import Head from "next/head";


const SignIn: NextPage<GoogleProviderTypes> = ({ providers }) => {
   return (
      <div>
         <Head>
            <title>Sign In - master-project</title>
         </Head>
         <div className="">
            <p className="">my master project - sign in</p>
            <div className="">
               {Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                     <button
                        className=""
                        onClick={() => signInToProvider(provider.id, { callbackUrl: '/create-app ' })}
                     >
                        Sign in with {provider.name}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};


export const getServerSideProps: GetServerSideProps = async () => {
   const providers = await getProviders();

   return { props: { providers } };
};

export default SignIn;
