import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../redux/slices/shopDetails.slice";

const useSecurePage = (shopAppId: string | string[] | undefined) => {
   const router = useRouter();
   const user = auth.currentUser;
   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const [isAdmin, setIsAdmin] = useState(false);


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      if (shopAppId && shopDetails && user) {
         if (user.uid === shopDetails.accountID) {
            setIsAdmin(true);
         } else {
            setIsAdmin(false);
            // router.push(`/${shopAppId}`);
         }
      } else if (shopAppId && !user) {
         setIsAdmin(false);
         // router.push(`/${shopAppId}`);
      }
   }, [shopDetails, user]);

   return isAdmin;
};

export default useSecurePage;
