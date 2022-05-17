import { Button, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn as signInProvider, signOut as signOutProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount, User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPageId, setAppPageId } from "../../../redux/slices/pageId.slice";
import About from "./about";


const Info = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const { data: session } = useSession();

   const dispatch = useAppDispatch();
   // const pageId = useAppSelector(selectPageId);
   // console.log('page: ', pageId);


   const [user, setUser] = useState<User | null>();
   const [isUser, setIsUser] = useState(false);


   useEffect(() => auth.onAuthStateChanged(user => {
      user ? setIsUser(true) : setIsUser(false);
      // console.log(user);
      setUser(user);
   }));

   useEffect(() => {
      dispatch(setAppPageId('settings_page'));
   }, []);


   return (
      <>
         <Head>
            {/* <title>{shopDetails?.name ? shopDetails?.name : '·'}</title> */}
            <title>{'Info · shop-name'}</title>
            <meta name="description" content="" />
         </Head>

         <About />
      </>
   );
};

export default Info;
