import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect, useState } from "react";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";
import { useRouter } from "next/router";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { database, storage } from "../../../config/firebase.config";
import { signOut as signOutProvider } from "next-auth/react";
import { auth } from "../../../config/firebase.config";
import { signOut as signOutAccount, deleteUser, User } from "firebase/auth";
import { deleteObject, ref } from "firebase/storage";


const Account = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);

   const [user, setUser] = useState<User | null>();
   const [prodIds, setProdIds] = useState([] as string[]);
   // (prodIds.length > 0) && console.log('prod:', prodIds);


   function deleteProducts() {
      return new Promise(resolve => {
         prodIds.forEach(id => {
            // console.log(id);
            const imageRef = ref(storage, `/product-images/${shopDetails?.data?.urlName}/PRODUCT_IMG:${id}`);
            deleteObject(imageRef).then(() => {
               deleteDoc(doc(database, "shops", shopDetails?.data?.urlName, "products", id)).then(() => {
                  // console.log('Deleted');
                  resolve(null);
               });
            });
         });
      });
   }

   const handleAccountDelete = async () => {
      const confirmShopUrlName = prompt("Please enter your Shop Url Name :");

      if (confirmShopUrlName === shopAppId) {
         if (prodIds.length > 0) {
            // #if product exist
            await deleteProducts().then(() => {
               deleteDoc(doc(database, "shops", shopDetails?.data?.urlName)).then(() => {
                  // console.log('done with delete');

                  deleteUser(user!).then(() => {
                     signOutProvider({ redirect: false }).then(() => {
                        router.push('/');
                     });
                  });
               });
            });
         } else {
            // #if there is no product exist
            await deleteDoc(doc(database, "shops", shopDetails?.data?.urlName)).then(() => {
               // console.log('done without delete');

               deleteUser(user!).then(() => {
                  signOutProvider({ redirect: false }).then(() => {
                     router.push('/');
                  });
               });
            });
         }
      } else {
         alert('You Entered Shop Url Name is Wrong.');
      }
   };


   useEffect(() => {
      (shopDetails?.data) && onSnapshot(collection(database, 'shops', shopDetails.data.urlName, 'products'), (snapshot) => {
         const arr: Array<string> = [];
         snapshot.forEach(obj => {
            arr.push(obj.id);
         });
         // console.log(arr);
         setProdIds(arr);
      });
   }, [database, shopDetails]);

   useEffect(() => auth.onAuthStateChanged(user => {
      setUser(user);
   }));

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
