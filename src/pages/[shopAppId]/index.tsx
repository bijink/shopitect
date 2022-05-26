// *shopApp homePage
import type { NextPage } from 'next';
import type { ProdDetailsTypes } from '../../types/pages/shopHomePage.types';

import Head from 'next/head';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectShopDetails, setAppShopDetailsAsync } from '../../redux/slices/shopDetails.slice';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import Public_layout from '../../layouts/Public.layout';
import ShopAdmin_layout from '../../layouts/ShopAdmin.layout';
import useSecurePage from '../../hooks/useSecurePage';
import { Stack, Typography } from '@mui/material';
import PageLoading_layout from '../../layouts/PageLoading.layout';
import NotFound from '../404';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);


   useEffect(() => {
      shop?.data && onSnapshot(collection(database, 'shops', shop.data.urlName!, 'products'), (snapshot) => {
         setProdDetails(snapshot.docs);
         setFetchDelayOver(true);
      });
   }, [database, shop]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppId));
   }, [shopAppId]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   return (
      <>
         <Head>
            <title>{shop?.data ? shop.data.name : 'Loading...'}</title>
            <meta name="description" content="" />
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
            )) || ((secure === '404') && (
               <NotFound />
            ))}
         </>
      </>
   );
};

export default Shop;
