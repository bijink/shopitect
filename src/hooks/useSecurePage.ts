// *securePage hook
import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../redux/slices/shopDetails.slice";
import { User } from "firebase/auth";


const useSecurePage = (shopAppId: string | string[] | undefined) => {
   const dispatch = useAppDispatch();

   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails.length);

   const [userData, setUserData] = useState<User | null | undefined>(undefined);
   // console.log(userData);

   // const [delayOver, setDelayOver] = useState(false);

   const [secure, setSecure] = useState<'200' | '401' | '403' | '404' | 'loading'>('loading');
   /**
    * 200 - OK - (user authorized, have content access)
    * 401 - Unauthorized - (user not authorized, not have content access)
    * 403 - Forbidden -(user authorized, not have content access)
    * 404 - Not Found - (page not exist)
    */


   useEffect(() => auth.onAuthStateChanged(user => {
      setUserData(user);
   }));

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   useEffect(() => {
      if (shopAppId && shopDetails) {
         // !userData && setDelayOver(true);
         if (userData && (shopDetails.length === 1)) {
            // setDelayOver(false);
            if (userData.uid === shopDetails.data?.accountID) {
               setSecure('200');
            } else {
               setSecure('403');
            }
            // } else if (!userData && (shopDetails.length === 1)) {
            // } else if (!userData) {
         } else if (userData === null) {
            // delayOver && setSecure('401');
            setSecure('401');
         } else if ((shopDetails.length === 0)) {
            setSecure('404');
            // } else if ((shopDetails.length === null)) {
         } else if ((shopDetails.length === null) || (userData === undefined)) {
            setSecure('loading');
         }
      }
      // }, [shopDetails, userData, delayOver]);
   }, [shopDetails, userData]);

   return secure;
};

export default useSecurePage;
