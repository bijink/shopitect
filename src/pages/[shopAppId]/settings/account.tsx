import type { NextPage } from "next";

import { Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect, useState } from "react";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import { PageLoading_layout, SettingsPage_layout } from "../../../layouts";
import { useRouter } from "next/router";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import Forbidden from "../../403";
import { useSecurePage, useUser } from "../../../hooks";
import NotFound from "../../404";
import AccountDeleteModal from "../../../components/accountDeleteModal";
import Head from "next/head";
import { signIn as signInProvider } from "next-auth/react";
import ShopPagesHead from "../../../components/shopPagesHead";


const Account: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   // const { user } = useUser();

   const [hasAccountDeleteCall, setHasAccountDeleteCall] = useState(false);


   useEffect(() => {
      // (secure === '401') && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
      (secure === '401') && router.push('/');
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('account_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Account" />

         {((secure === 'loading' || hasAccountDeleteCall) && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <SettingsPage_layout title={'Account'} >
               <>
                  <Box>
                     <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
                     <AccountDeleteModal setHasAccountDeleteCall={setHasAccountDeleteCall} />
                  </Box>
               </>
            </SettingsPage_layout>
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Account;
