import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase.config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShopDetails, setAppShopDetailsAsync } from "../redux/slices/shopDetails.slice";
import { User } from "firebase/auth";

const useHasAdmin = (shopAppId: string | string[] | undefined) => {
   const router = useRouter();
   // const user = auth.currentUser;
   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);

   const [hasAdmin, setHasAdmin] = useState(false);
   const [user, setUser] = useState<User | null>();


   useEffect(() => auth.onAuthStateChanged(user => {
      setUser(user);
   }));

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      if (shopAppId && shopDetails && user) {
         if (user.uid === shopDetails.accountID) {
            setHasAdmin(true);
         } else {
            setHasAdmin(false);
            // router.push(`/${shopAppId}`);
         }
      } else if (shopAppId && !user) {
         setHasAdmin(false);
         // router.push(`/${shopAppId}`);
      }
   }, [shopDetails, user]);

   return hasAdmin;
};

export default useHasAdmin;
