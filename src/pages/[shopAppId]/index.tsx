// *shopApp homePage
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProductCard from '../../components/productCard';
import { auth } from '../../config/firebase.config';
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


   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);


   return (
      <>
         <Head>
            <title>{shopDetails?.shopName ? shopDetails?.shopName : '·'}</title>
            <meta name="description" content="" />
         </Head>
         <PublicSection_layout >
            <ProductCard />
         </PublicSection_layout>
      </>
   );
};

export default Shop;
