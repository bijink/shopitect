import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { signIn as signInProvider, signOut as signOutProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount, User } from "firebase/auth";
import { useAppDispatch } from "../../../redux/hooks";
import InfoPage_layout from "../../../layouts/InfoPage.layout";
import { setAppPageId } from "../../../redux/slices/pageId.slice";


const Admin = () => {
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
      <InfoPage_layout>
         {!isUser ? (
            <Button variant="contained" onClick={() => {
               // !isUser
               //    ? signInProvider('google', { redirect: false, callbackUrl: `/auth/login` })
               //    : router.push(`/auth/login`);
               signInProvider('google', { redirect: false, callbackUrl: `/auth/login` });
            }} >login</Button>
         ) : (shopAppId && (
            <Button variant="contained" style={{ textTransform: 'none' }} onClick={() => {
               signOutAccount(auth).then(() => {
                  // signOutProvider({ redirect: false, callbackUrl: `/${shopAppId}` });
                  signOutProvider({ redirect: false }).then(() => {
                     router.push(`/${shopAppId}`);
                  });
               });
            }} >{`${'logout'.toUpperCase()} ${user?.displayName}`}</Button>
         ))}
      </InfoPage_layout>
   );
};

export default Admin;
