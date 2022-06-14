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
import { PageSkeleton_layout, Page_layout } from '../../layouts';
import { useSecurePage } from '../../hooks';
import { CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import NotFound from '../404';
import { selectProdSearchInput, setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { Public_navBar, ShopAdmin_navBar } from '../../components/navBar';
import { Public_sideBar, ShopAdmin_sideBar } from '../../components/sideBar';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, category, page } = router.query;
   // console.log(shopAppUrl);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   const searchInput_prod = useAppSelector(selectProdSearchInput);
   // console.log(searchInput_prod);

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);

   const listLength = 10;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_category, setProdDetails_category] = useState<DocumentData>([]);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);
   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);
   const [prodDocLength, setProdDocLength] = useState(0);
   const [pageLength, setPageLength] = useState(1);


   //create a new array by filtering the original array
   const filteredProducts = prodDetails.filter((obj: DocumentData) => {
      if (searchInput_prod !== '') {
         return obj.data().name.toLowerCase().includes(searchInput_prod);
      }
   });


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
         setProdDetails(snapshot.docs);
      });
      // }, [database, shop, searchInput_prod]);
   }, [database, shop]);

   useEffect(() => {
      setProdDocLength(prodDetails.length);
      setPageLength(Math.ceil(prodDetails.length / listLength));

      if (category) {
         dispatch(setProdSearchInput(''));

         if (category === 'all') {
            setProdDetails_category(prodDetails);
            setTimeout(() => setFetchDelayOver(true), 5000);
         } else {
            const categoryFilter: Array<DocumentData> = prodDetails.filter((item: DocumentData) => item.data().category === category);
            setProdDetails_category(categoryFilter);
            setTimeout(() => setFetchDelayOver(true), 5000);
         }
      } else {
         if ((page && prodDocLength)) {
            let arr = [];
            let pageInt;

            // #creating 2D array to store prodDetails slice start&end points
            for (let i = 1; i <= pageLength; i++) {
               arr.push([((i * listLength) - listLength), (i * listLength)]);
            }

            // #to catch and solve page breaking due to unmatchable page number
            if ((parseInt(page.toString()) > arr.length)) {
               router.push(`/${shopAppUrl}?page=${pageLength}`);
               pageInt = pageLength;
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shopAppUrl}?page=${'1'}`);
               pageInt = 1;
            } else {
               pageInt = parseInt(page.toString());
            }

            setProdDetails_category(prodDetails.slice(arr[pageInt - 1][0], arr[pageInt - 1][1]));
         } else {
            setProdDetails_category(prodDetails.slice(0, listLength));
         }

         setTimeout(() => setFetchDelayOver(true), 5000);
      }
   }, [database, category, prodDetails, page, prodDocLength, pageLength, searchInput_prod]);

   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         // console.log(snapshot.docs.length);
         if (snapshot.docs.length == 0) {
            setShopNotExistOnServer(true);
            sessionStorage.removeItem('shop-details');
         }
      });
   }, [database, shopAppUrl]);

   useEffect(() => {
      dispatch(setAppShopDetailsAsync(shopAppUrl));
   }, [shopAppUrl]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   const ProductCardWrap = () => (
      <Stack direction={'column'} >
         {(prodDocLength > 0) ?
            <>
               <Stack direction={'row'} justifyContent="center" alignItems="center" flexWrap="wrap" >
                  {(filteredProducts.length ? filteredProducts : prodDetails_category).map((prod: ProdDetailsTypes, index: number) => (
                     <ProductCard key={index}
                        shopUrlName={shop?.data?.urlName}

                        prodId={prod.id}
                        prodName={prod.data().name}
                        prodImg={prod.data().imageUrl}
                        prodCategory={prod.data().category}
                        sellPrice={prod.data().sellPrice}
                     />
                  ))}
               </Stack>
               <Stack direction='row' spacing={1} pt={2} justifyContent="center" alignItems="center" >
                  {(!category && !(filteredProducts.length > 0)) && (
                     <Pagination
                        count={pageLength}
                        page={page ? (parseInt(page.toString())) : 1}
                        onChange={(_, value: number) => {
                           router.push(`/${shopAppUrl}?page=${value}`);
                        }}
                        showFirstButton showLastButton
                     />
                  )}
               </Stack>
            </>
            :
            <Stack justifyContent="center" alignItems="center" >
               {(fetchDelayOver)
                  ? <Typography variant="h5" component="p" >No Products</Typography>
                  : <CircularProgress />
               }
            </Stack>
         }
      </Stack>
   );


   return (
      <>
         <Head>
            <title>{shop?.data ? shop.data.name : ((secure !== 404) ? 'Loading...' : '404')}</title>
            <meta name="description" content="" />
            <meta property="og:title" content={shop?.data?.name} key="title" />
         </Head>

         <>
            {((secure === 'loading') && (
               <PageSkeleton_layout />
            )) || ((secure === 200) && (
               <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<ShopAdmin_sideBar />} >
                  <ProductCardWrap />
               </Page_layout>
            )) || (((secure === 404) || shopNotExistOnServer) && (
               <NotFound />
            )) || (((secure === 401) || (secure === 403)) && (
               <Page_layout navbar={<Public_navBar />} sidebar={<Public_sideBar />} >
                  <ProductCardWrap />
               </Page_layout>
            ))}
         </>
      </>
   );
};

export default Shop;
