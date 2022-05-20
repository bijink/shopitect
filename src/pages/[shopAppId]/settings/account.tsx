import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect, useState } from "react";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";
import { useRouter } from "next/router";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import { signOut as signOutProvider } from "next-auth/react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount, deleteUser } from "firebase/auth";


const Account = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);

   const user = auth.currentUser;
   // console.log(user);

   const [prodIds, setProdIds] = useState([] as string[]);
   // (prodIds.length > 0) && console.log('prod:', prodIds);


   function deleteProds() {
      return new Promise(resolve => {
         prodIds.forEach(id => {
            // console.log(id);
            deleteDoc(doc(database, "shops", shopDetails.urlName, "products", id)).then(() => {
               // console.log('Deleted');
               resolve(null);
            });
         });
      });
   }

   const handleAccountDelete = async () => {
      const confirmShopUrlName = prompt("Please enter your Shop Url Name :");

      if (confirmShopUrlName === shopAppId) {
         if (prodIds.length > 0) {
            // #if product exist
            await deleteProds().then(() => {
               deleteDoc(doc(database, "shops", shopDetails.urlName)).then(() => {
                  // console.log('done with delete');

                  signOutAccount(auth).then(() => {
                     signOutProvider({ redirect: false }).then(() => {
                        deleteUser(user!).then(() => {
                           // User deleted.
                           router.push('/');
                        });
                     });
                  });
               });
            });
         } else {
            // #if there is no product exist
            await deleteDoc(doc(database, "shops", shopDetails.urlName)).then(() => {
               // console.log('done without delete');

               signOutAccount(auth).then(() => {
                  signOutProvider({ redirect: false }).then(() => {
                     deleteUser(user!).then(() => {
                        // User deleted.
                        router.push('/');
                     });
                  });
               });
            });
         }
      } else {
         alert('You Entered Shop Url Name is Wrong.');
      }
   };


   useEffect(() => {
      (shopDetails.urlName) && onSnapshot(collection(database, 'shops', shopDetails.urlName, 'products'), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         // console.log(arr);
         setProdIds(arr);
      });
   }, [database, shopDetails.urlName]);

   useEffect(() => {
      dispatch(setAppPageId('account_page'));
   }, []);


   return (
      <SettingsPage_layout title={'Account'} >
         <>
            <Box>
               <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
               <Button variant="outlined" size="small" color={'error'} sx={{ textTransform: 'none' }}
                  onClick={handleAccountDelete}
               >Delete your account</Button>
            </Box>
         </>
      </SettingsPage_layout>
   );
};

export default Account;
