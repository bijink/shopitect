// *shopApp homePage
import type { NextPage } from 'next';

import Head from 'next/head';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import PublicSection_layout from '../../layouts/Public.layout';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../redux/slices/shopDetails.slice';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import Public_layout from '../../layouts/Public.layout';
import useIsAdmin from '../../hooks/useIsAdmin';
import ShopAdmin_layout from '../../layouts/ShopAdmin.layout';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   // console.log(auth.currentUser);

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);
   const isAdmin = useIsAdmin(shopAppId);

   const [isShopExist, setIsShopExist] = useState(false);


   useEffect(() => {
      shopAppId && getDoc(doc(database, 'shops', shopAppId.toString())).then((snap) => {
         // console.log(snap.data());
         if (snap.data()) {
            setIsShopExist(true);
         } else {
            setIsShopExist(false);
         }
      });
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shopDetails?.name ? shopDetails?.name : 'shop-name'}</title>
            <meta name="description" content="" />
         </Head>

         {isShopExist && (
            <>
               {isAdmin ? (
                  <ShopAdmin_layout>
                     <ProductCard />
                  </ShopAdmin_layout>
               ) : (
                  <Public_layout>
                     <ProductCard />
                  </Public_layout>
               )}
            </>
         )}
      </>
   );
};

export default Shop;
