import type { NextPage } from "next";

import { capitalize } from "@mui/material";
import { useRouter } from "next/router";
import { Account_tab, Profile_tab } from "../../components/pageTabs/settingsPage";
import ShopPagesHead from "../../components/shopPagesHead";
import { useSecurePage } from "../../hooks";
import { PageLoading_layout, SettingsPage_layout } from "../../layouts";
import Forbidden from "../403";
import NotFound from "../404";
import { useEffect } from "react";
import { signIn as signInProvider } from "next-auth/react";
import { useAppDispatch } from "../../redux/hooks";
import { setAppPageId } from "../../redux/slices/pageId.slice";


const Settings: NextPage = () => {
   const router = useRouter();
   const { shopAppId, tab } = router.query;

   const dispatch = useAppDispatch();

   const secure = useSecurePage(shopAppId);
   // console.log(secure);


   useEffect(() => {
      if (secure === '401') {
         if (tab === 'account') router.push(`/${shopAppId}`);
         else signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
      }
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('settings_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Settings" />

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <SettingsPage_layout title={tab && capitalize(tab.toString())} >
               {
                  ((!tab) && <Profile_tab />)
                  ||
                  ((tab === 'profile') && <Profile_tab />)
                  ||
                  ((tab === 'account') && <Account_tab />)
               }
            </SettingsPage_layout>
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Settings;
