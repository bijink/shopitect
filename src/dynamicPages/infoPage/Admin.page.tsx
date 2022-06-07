import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { signIn as signInProvider, signOut as signOutProvider } from "next-auth/react";
import { auth } from "../../config/firebase.config";
import { signOut as signOutAccount } from "firebase/auth";
import { useUser } from "../../hooks";


const Admin_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const { user, status: userStatus } = useUser();


   return (
      <>
         {(userStatus === 'unauthenticated') ? (
            <Button variant="contained" onClick={() => {
               signInProvider('google', { redirect: false, callbackUrl: `/auth/login` });
            }} >login</Button>
         ) : (shopAppUrl && (
            <Button variant="contained" style={{ textTransform: 'none' }} onClick={() => {
               signOutAccount(auth).then(() => {
                  signOutProvider({ redirect: false, callbackUrl: `/${shopAppUrl}/info/admin` });
               });
            }} >{`${'logout'.toUpperCase()} ${user?.displayName}`}</Button>
         ))}
      </>
   );
};

export default Admin_page;
