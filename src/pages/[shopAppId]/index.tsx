// *shopApp homePage
import type { NextPage } from 'next';

import Head from 'next/head';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { auth, database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../redux/slices/shopDetails.slice';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import Public_layout from '../../layouts/Public.layout';
import ShopAdmin_layout from '../../layouts/ShopAdmin.layout';
import useSecurePage from '../../hooks/useSecurePage';
import { Typography } from '@mui/material';
import PageNotFound from '../../components/pageNotFound';
import PageLoading_layout from '../../layouts/PageLoading.layout';
import useUser from '../../hooks/useUser';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   // const [isShopExist, setIsShopExist] = useState(false);


   // useEffect(() => {
   //    shopAppId && getDoc(doc(database, 'shops', shopAppId.toString())).then((snap) => {
   //       // console.log(snap.data());
   //       if (snap.data()) {
   //          setIsShopExist(true);
   //       } else {
   //          setIsShopExist(false);
   //       }
   //    });
   // }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   const { user, status } = useUser();
   // console.log(status);
   // console.log(user);


   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   return (
      <>
         <Head>
            {/* <title>{shopDetails?.name ? shopDetails?.name : 'shop-name'}</title> */}
            <meta name="description" content="" />
         </Head>

         <>
            {((secure === 'loading') && (
               <PageLoading_layout />
            )) || ((secure === '200') && (
               <ShopAdmin_layout>
                  <ProductCard />
               </ShopAdmin_layout>
            )) || (((secure === '401') || (secure === '403')) && (
               <Public_layout>
                  <ProductCard />
               </Public_layout>
            )) || ((secure === '404') && (
               <PageNotFound />
            ))}
            {/* <PageLoading_layout /> */}
         </>
      </>
   );
};

export default Shop;
