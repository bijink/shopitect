import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { signIn as signInProvider, signOut as signOutProvider } from "next-auth/react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount } from "firebase/auth";
import { useUser } from "../../../hooks";


const Admin_tab = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const { user, status: userStatus } = useUser();


   return (
      <>
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
      </>
   );
};

export default Admin_tab;
