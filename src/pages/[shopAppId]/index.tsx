import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import PublicSection_layout from '../../layouts/PublicSection.layout';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetails } from '../../redux/slices/shopDetails.slice';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);


   // const [shopDetails, setShopDetails] = useState<DocumentData>([]);


   useEffect(() => {
      shopAppId &&
         onSnapshot(query(collection(database, 'shops'), where('shopUrlName', '==', shopAppId)), (snapshot) => {
            snapshot.forEach(obj => {
               // setShopDetails(obj.data());
               dispatch(setAppShopDetails(obj.data()));
            });
         });
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
