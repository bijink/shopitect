import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import PublicSection_layout from '../../layouts/PublicSection.layout';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopId } = router.query;
   // console.log('shopId : ', shopId);
   // console.log(router.query.shopId);


   const [shopDetails, setShopDetails] = useState<DocumentData>([]);


   useEffect(() => {
      shopId &&
         onSnapshot(query(collection(database, 'shops'), where('shopId', '==', shopId)), (snapshot) => {
            snapshot.forEach(obj => {
               setShopDetails(obj.data());
            });
         });
   }, [shopId]);

   return (
      <>
         <Head>
            <title>shopName</title>
            <meta name="description" content="" />
         </Head>
         <PublicSection_layout shopDetails={shopDetails}>
            <ProductCard />
         </PublicSection_layout>
      </>
   );
};

export default Shop;
