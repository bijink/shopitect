// *settings page
import type { NextPage } from "next";

import { capitalize } from "@mui/material";
import { useRouter } from "next/router";
import { Account_page, Profile_page } from "../../../dynamicPages/settingsPage";
import ShopPagesHead from "../../../components/shopPagesHead";
import { useSecurePage } from "../../../hooks";
import { PageSkeleton_layout, Page_layout } from "../../../layouts";
import Forbidden from "../../403";
import NotFound from "../../404";
import { useEffect } from "react";
import { signIn as signInProvider } from "next-auth/react";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import { ShopAdmin_navBar } from "../../../components/navBar";
import { SettingsPage_sideBar } from "../../../components/sideBar";

const SettingsPages: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, settingsPages } = router.query;

   const dispatch = useAppDispatch();

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);


   useEffect(() => {
      if (secure === 401) {
         if (settingsPages === 'account') router.push(`/${shopAppUrl}`);
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
            <PageSkeleton_layout />
         )) || (((secure === 404)
            || !((settingsPages === 'profile') || (settingsPages === 'account'))) && (
               <NotFound />
            )) || ((secure === 200) && (
               <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<SettingsPage_sideBar />} title={settingsPages && capitalize(settingsPages.toString())} >
                  {
                     ((settingsPages === 'profile') && <Profile_page />)
                     ||
                     ((settingsPages === 'account') && <Account_page />)
                  }
               </Page_layout>
            )) || ((secure === 403) && (
               <Forbidden />
            ))}
      </>
   );
};

export default SettingsPages;
