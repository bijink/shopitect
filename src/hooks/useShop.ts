// *shopData & shopSecurePage hook
import type { User } from "firebase/auth";
import type { ShopData } from "../types/global.types";

import { useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAppShopDetailsAsync, selectShopDetails } from "../redux/slices/shopDetails.slice";


const useShop = (shopAppUrl: string | string[] | undefined) => {
   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const [userData, setUserData] = useState<User | null | undefined>(undefined);

   // #shopData
   // const [data, setData] = useState<ShopData | undefined>(undefined);
   const [data, setData] = useState<ShopData | null>(null);
   // #shopSecurePage
   const [secure, setSecure] = useState<'loading' | 200 | 401 | 403 | 404>('loading');
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
      dispatch(setAppShopDetailsAsync(shopAppUrl));
   }, [shopAppUrl]);


   // *shopData
   useEffect(() => {
      shopDetails.length && setData(shopDetails.data!);
   }, [shopDetails]);
   // *shopSecure
   useEffect(() => {
      if (shopAppUrl && shopDetails) {
         if ((shopDetails.length === null) || (userData === undefined)) {
            setSecure('loading');
         }
         else if (userData && (shopDetails.length === 1)) {
            if (userData.uid === shopDetails.data?.accountID) {
               setSecure(200);
            } else {
               setSecure(403);
            }
         }
         else if ((shopDetails.length === 0)) {
            setSecure(404);
         }
         else if (userData === null) {
            setSecure(401);
         }
      }
   }, [shopDetails, userData]);

   return { data, secure };
};

export default useShop;
