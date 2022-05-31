// *shopApp homePage
import type { NextPage } from 'next';
import type { ProdDetailsTypes } from '../../types/pages/shopHomePage.types';

import Head from 'next/head';
import { collection, DocumentData, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../redux/slices/shopDetails.slice';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import { PageLoading_layout, Public_layout, ShopAdmin_layout } from '../../layouts';
import { useSecurePage } from '../../hooks';
import { Stack, Typography } from '@mui/material';
import NotFound from '../404';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId, category } = router.query;
   // console.log(shopAppId);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);
   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);


   useEffect(() => {
      if (category) {
         if (category === 'all') {
            (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
               setProdDetails(snapshot.docs);
               setFetchDelayOver(true);
            });
         } else {
            (shop?.data && category) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), where('category', '==', category), orderBy('createdAt', 'desc')), (snapshot) => {
               setProdDetails(snapshot.docs);
               setFetchDelayOver(true);
            });
         }
      } else {
         (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
            setProdDetails(snapshot.docs);
            setFetchDelayOver(true);
         });
      }
   }, [database, shop, category]);

   useEffect(() => {
      shopAppId && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppId)), (snapshot) => {
         // console.log(snapshot.docs.length);
         if (snapshot.docs.length == 0) {
            setShopNotExistOnServer(true);
            sessionStorage.removeItem('shop-details');
         }
      });
   }, [database, shopAppId]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shop?.data ? shop.data.name : ((secure !== '404') ? 'Loading...' : '404')}</title>
            <meta name="description" content="" />
            <meta property="og:title" content={shop?.data?.name} key="title" />
         </Head>

         <>
            {((secure === 'loading') && (
               <PageLoading_layout />
            )) || ((secure === '200') && (
               <ShopAdmin_layout>
                  {(fetchDelayOver && (prodDetails.length < 1)) ? (
                     <Stack justifyContent="center" alignItems="center" >
                        <Typography variant="h5" component="p" >No Products</Typography>
                     </Stack>
                  ) : (
                     <Stack direction={'row'} justifyContent="center" alignItems="center" flexWrap="wrap" >
                        {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
                           <ProductCard key={index}
                              shopUrlName={shop?.data?.urlName}

                              prodId={prod.id}
                              prodName={prod.data().name}
                              prodImg={prod.data().imageUrl}
                              prodBrand={prod.data().brand}
                              prodCategory={prod.data().category}
                              quantity={prod.data().quantity}
                              sellPrice={prod.data().sellPrice}
                              createdAt={prod.data().createdAt}
                           />
                        ))}
                     </Stack>
                  )}
               </ShopAdmin_layout>
            )) || (((secure === '404') || shopNotExistOnServer) && (
               <NotFound />
            )) || (((secure === '401') || (secure === '403')) && (
               <Public_layout>
                  {(fetchDelayOver && (prodDetails.length < 1)) ? (
                     <Stack justifyContent="center" alignItems="center" >
                        <Typography variant="h5" component="p" >No Products</Typography>
                     </Stack>
                  ) : (
                     <Stack direction={'row'} justifyContent="center" alignItems="center" flexWrap="wrap" >
                        {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
                           <ProductCard key={index}
                              shopUrlName={shop?.data?.urlName}

                              prodId={prod.id}
                              prodName={prod.data().name}
                              prodImg={prod.data().imageUrl}
                              prodBrand={prod.data().brand}
                              prodCategory={prod.data().category}
                              quantity={prod.data().quantity}
                              sellPrice={prod.data().sellPrice}
                              createdAt={prod.data().createdAt}
                           />
                        ))}
                     </Stack>
                  )}
               </Public_layout>
            ))}
         </>
      </>
   );
};

export default Shop;
