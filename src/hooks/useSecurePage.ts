// *securePage hook
import type { User } from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../redux/slices/shopDetails.slice";


const useSecurePage = (shopAppId: string | string[] | undefined) => {
   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopAppId);


   const [userData, setUserData] = useState<User | null | undefined>(undefined);
   const [secure, setSecure] = useState<'loading' | '200' | '401' | '403' | '404'>('loading');
   /**
    *# 200 - OK - (user authorized, have content access)
    *# 401 - Unauthorized - (user not authorized, not have content access)
    *# 403 - Forbidden -(user authorized, not have content access)
    *# 404 - Not Found - (page not exist)
    */


   useEffect(() => auth.onAuthStateChanged(user => {
      setUserData(user);
   }));

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   useEffect(() => {
      if (shopAppId && shopDetails) {
         if ((shopDetails.length === null) || (userData === undefined)) {
            setSecure('loading');
         }
         else if (userData && (shopDetails.length === 1)) {
            if (userData.uid === shopDetails.data?.accountID) {
               setSecure('200');
            } else {
               setSecure('403');
            }
         }
         else if ((shopDetails.length === 0)) {
            setSecure('404');
         }
         else if (userData === null) {
            setSecure('401');
         }
      }
   }, [shopDetails, userData]);

   return secure;
};

export default useSecurePage;
