// *shopApp homePage
import type { NextPage } from 'next';

import Head from 'next/head';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import PublicSection_layout from '../../layouts/PublicSection.layout';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../redux/slices/shopDetails.slice';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   // console.log(auth.currentUser);


   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);

   const [isShopExist, setIsShopExist] = useState(false);


   useEffect(() => {
      shopAppId && getDoc(doc(database, 'shops', shopAppId)).then((snap) => {
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


   return (
      <>
         <Head>
            <title>{shopDetails?.name ? shopDetails?.name : '·'}</title>
            <meta name="description" content="" />
         </Head>

         {isShopExist && (
            <PublicSection_layout >
               <ProductCard />
            </PublicSection_layout>
         )}
      </>
   );
};

export default Shop;
