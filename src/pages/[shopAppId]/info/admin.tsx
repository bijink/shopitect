import type { NextPage } from "next";

import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { signIn as signInProvider, signOut as signOutProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount, User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { InfoPage_layout, PageLoading_layout } from "../../../layouts";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import { useSecurePage, useUser } from "../../../hooks";
import NotFound from "../../404";
import Head from "next/head";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import ShopPagesHead from "../../../components/shopPagesHead";


const Admin: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   // const { data: session } = useSession();

   const dispatch = useAppDispatch();

   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   const { user, status: userStatus } = useUser();


   useEffect(() => {
      dispatch(setAppPageId('admin_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Admin" />

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <NotFound />
         )) || (((secure === '401') || (secure === '403')) && (
            <InfoPage_layout>
               {(userStatus === 'unauthenticated') ? (
                  <Button variant="contained" onClick={() => {
                     signInProvider('google', { redirect: false, callbackUrl: `/auth/login` });
                  }} >login</Button>
               ) : (shopAppId && (
                  <Button variant="contained" style={{ textTransform: 'none' }} onClick={() => {
                     signOutAccount(auth).then(() => {
                        signOutProvider({ redirect: false, callbackUrl: `/${shopAppId}/info/admin` });
                     });
                  }} >{`${'logout'.toUpperCase()} ${user?.displayName}`}</Button>
               ))}
            </InfoPage_layout>
         ))}
      </>
   );
};

export default Admin;
