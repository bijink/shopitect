import type { NextPage } from "next";

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
import { deleteUser } from "firebase/auth";
import { deleteObject, ref } from "firebase/storage";
import { signIn as signInProvider } from "next-auth/react";
import Forbidden from "../../403";
import useSecurePage from "../../../hooks/useSecurePage";
import PageLoading_layout from "../../../layouts/PageLoading.layout";
import useUser from "../../../hooks/useUser";
import NotFound from "../../404";
import AccountDeleteModal from "../../../components/accountDeleteModal";


const Account: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const { user } = useUser();

   // const [prodIds, setProdIds] = useState([] as string[]);
   // // (prodIds.length > 0) && console.log('prod:', prodIds);


   // function deleteProducts() {
   //    return new Promise(resolve => {
   //       prodIds.forEach(id => {
   //          // console.log(id);
   //          const imageRef = ref(storage, `/product-images/${shop?.data?.urlName}/PRODUCT_IMG:${id}`);
   //          deleteObject(imageRef).then(() => {
   //             deleteDoc(doc(database, "shops", shop?.data?.urlName, "products", id)).then(() => {
   //                // console.log('Deleted');
   //                resolve(null);
   //             });
   //          });
   //       });
   //    });
   // }
   // function deleteAccount() {
   //    return new Promise(resolve => {
   //       (shop?.data) && deleteDoc(doc(database, "shops", shop.data.urlName)).then(() => {
   //          signOutProvider({ redirect: false }).then(() => {
   //             user && deleteUser(user).then(() => {
   //                // router.reload();
   //                resolve(null);
   //             });
   //          });
   //       });
   //    });
   // }

   // const handleAccountDelete = async () => {
   //    const confirmShopUrlName = prompt("Please enter your Shop Url Name :");

   //    if (confirmShopUrlName === shopAppId) {
   //       await deleteAccount().then(() => {
   //          router.push('/');
   //       });

   //       // 
   //       // if (prodIds.length > 0) {
   //       //    // #if product exist
   //       //    await deleteProducts().then(() => {
   //       //       deleteAccount().then(() => {
   //       //          router.push('/');
   //       //       });
   //       //    });
   //       // } else {
   //       //    // #if there is no product exist
   //       //    await deleteAccount().then(() => {
   //       //       router.push('/');
   //       //    });
   //       // }
   //       // 

   //       // else {
   //       //    // #if there is no product exist
   //       //    await deleteAccount().then(() => {
   //       //       router.push('/');
   //       //    });
   //       //    // await deleteAccount();
   //       // }


   //       //    if (prodIds.length > 0) {
   //       //       // #if product exist
   //       //       await deleteProducts().then(() => {
   //       //          deleteDoc(doc(database, "shops", shop?.data?.urlName)).then(() => {
   //       //             // console.log('done with delete');

   //       //             // router.push('/');
   //       //             deleteUser(user!).then(() => {
   //       //                // signOutProvider({ callbackUrl: '/' });

   //       //                // signOutProvider({ callbackUrl: '/' });

   //       //                // signOutProvider({ redirect: false }).then(() => {
   //       //                //    router.push('/');
   //       //                // });
   //       //                signOutProvider().then(() => {
   //       //                   router.push('/');
   //       //                });
   //       //                // signOutProvider({ redirect: false });
   //       //                // signOutProvider();
   //       //             });
   //       //          });
   //       //       });
   //       //    } else {
   //       //      // #if there is no product exist
   //       //       await deleteDoc(doc(database, "shops", shop?.data?.urlName)).then(() => {
   //       //          // console.log('done without delete');

   //       //          // router.push('/');
   //       //          deleteUser(user!).then(() => {
   //       //             signOutProvider({ callbackUrl: '/' });
   //       //             // signOutProvider({ callbackUrl: '/' });
   //       //             // signOutProvider({ redirect: false }).then(() => {
   //       //             signOutProvider().then(() => {
   //       //                router.push('/');
   //       //             });
   //       //             // signOutProvider({ redirect: false });
   //       //             signOutProvider();
   //       //          });
   //       //       });
   //       //    }
   //       // } else {
   //       //    alert('You Entered Shop Url Name is Wrong.');
   //       // }
   //    } else {
   //       alert('You Entered Shop Url Name is Wrong.');
   //    }
   // };


   // useEffect(() => {
   //    (shop?.data) && onSnapshot(collection(database, 'shops', shop.data.urlName, 'products'), (snapshot) => {
   //       const arr: Array<string> = [];
   //       snapshot.forEach(obj => {
   //          arr.push(obj.id);
   //       });
   //       // console.log(arr);
   //       setProdIds(arr);
   //    });
   // }, [database, shop]);

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
                     {/* <Button disabled={!user || !(shop?.data)} variant="outlined" size="small" color={'error'} sx={{ textTransform: 'none' }}
                        onClick={handleAccountDelete}
                     >Delete your account</Button> */}
                     <AccountDeleteModal />
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
