import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../redux/slices/shopDetails.slice";
import { User } from "firebase/auth";
import { signIn as signInProvider } from "next-auth/react";

const useSecurePage = (shopAppId: string | string[] | undefined) => {
   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const [secure, setSecure] = useState<'safe' | 'not-safe' | 'loading'>('loading');
   const [user, setUser] = useState<User | null>();


   useEffect(() => auth.onAuthStateChanged(user => {
      setUser(user);
   }));

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      // if (shopAppId && (shopDetails.accountID !== '') && user) {
      if (shopAppId && shopDetails && user) {
         // if (shopDetails.accountID && user.uid) {
         if (user.uid === shopDetails.accountID) {
            setSecure('safe');
         } else {
            // setSecure('not-safe');
            signInProvider('google', { redirect: false, callbackUrl: `/auth/login` });
         }
         // }
      }
      // else if (shopAppId && !user) {
      //    // setIsAdmin(false);
      //    setSecure('not-safe');
      //    // signInProvider('google', { redirect: false, callbackUrl: `/auth/login` });
      // }
   }, [shopDetails, user]);

   return secure;
};

export default useSecurePage;
