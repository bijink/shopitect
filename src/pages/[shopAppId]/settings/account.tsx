import type { NextPage } from "next";

import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";
import { useRouter } from "next/router";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import Forbidden from "../../403";
import useSecurePage from "../../../hooks/useSecurePage";
import PageLoading_layout from "../../../layouts/PageLoading.layout";
import useUser from "../../../hooks/useUser";
import NotFound from "../../404";
import AccountDeleteModal from "../../../components/accountDeleteModal";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";


const Account: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const { user } = useUser();


   // const handleDelete = () => {
   //    const userProvidedPassword = prompt('Enter your password');
   //    // console.log(userProvidedPassword);


   //    // TODO(you): prompt the user to re-provide their sign-in credentials
   //    const credential = EmailAuthProvider.credential(
   //       // auth.currentUser.email,
   //       user?.email!,
   //       userProvidedPassword!
   //    );

   //    reauthenticateWithCredential(user!, credential).then(() => {
   //       // User re-authenticated.
   //       console.log('re');

   //    }).catch((error) => {
   //       // An error ocurred
   //       // ...
   //       console.log('no-re');
   //    });
   // };


   useEffect(() => {
      dispatch(setAppPageId('account_page'));
   }, []);


   return (
      <>
         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <SettingsPage_layout title={'Account'} >
               <>
                  <Box>
                     <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
                     <AccountDeleteModal />
                     {/* <Button onClick={handleDelete} >Delete</Button> */}
                  </Box>
               </>
            </SettingsPage_layout>
         )) || ((secure === '401') && (
            // signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` })
            <Forbidden />
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Account;
