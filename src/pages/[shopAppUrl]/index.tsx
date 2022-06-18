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
import { setAppPageId } from '../../redux/slices/pageId.slice';
import { PageSkeleton_layout, Page_layout } from '../../layouts';
import { useShop } from '../../hooks';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import NotFound from '../404';
import { selectProdSearchInput, setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { Public_navBar, ShopAdmin_navBar } from '../../components/navBar';
import { Public_sideBar, ShopAdmin_sideBar } from '../../components/sideBar';


const ShopHome: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, category, page } = router.query;

   const dispatch = useAppDispatch();
   const searchInput_prod = useAppSelector(selectProdSearchInput);

   const { data: shop, secure } = useShop(shopAppUrl);

   const listLength = 10;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_new, setProdDetails_new] = useState<DocumentData>([]);
   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);
   const [prodDocLength, setProdDocLength] = useState<null | number>(null);
   const [pageLength, setPageLength] = useState(1);


   // #create a new array by filtering the original array
   const filteredProducts = prodDetails.filter((obj: DocumentData) => {
      if (searchInput_prod !== '') {
         return obj.data().name.toLowerCase().includes(searchInput_prod);
      }
   });


   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
         setProdDetails(snapshot.docs);
         setProdDocLength(snapshot.docs.length);
         setPageLength(Math.ceil(snapshot.docs.length / listLength));
      });
   }, [database, shop]);

   useEffect(() => {
      if (category) {
         dispatch(setProdSearchInput(''));

         if (category === 'all') {
            setProdDetails_new(prodDetails);
         } else {
            const categoryFilter: Array<DocumentData> = prodDetails.filter((item: DocumentData) => item.data().category === category);
            setProdDetails_new(categoryFilter);
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

            setProdDetails_new(prodDetails.slice(arr[pageInt - 1][0], arr[pageInt - 1][1]));
         } else {
            setProdDetails_new(prodDetails.slice(0, listLength));
         }
      }
   }, [database, category, prodDetails, page, prodDocLength, pageLength, searchInput_prod]);

   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         // console.log(snapshot.docs.length);
         if (snapshot.docs.length == 0) {
            setShopNotExistOnServer(true);
            sessionStorage.removeItem('shop-details');
         }

         let docsLength = null;
         let doc = null;

         if (snapshot.docs.length === 0) docsLength = 0;
         else if (snapshot.docs.length === 1) docsLength = 1;

         snapshot.forEach(obj => (doc = obj.data()));

         const shopDetails = {
            data: doc,
            length: docsLength,
         };

         sessionStorage.setItem('shop-details', JSON.stringify(shopDetails));
      });
   }, [database, shopAppUrl]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, []);


   const ProductCardWrap = () => (
      <Stack direction={'column'} >
         {((prodDocLength! > 0) || (prodDocLength === null)) ? (
            <>
               {((prodDocLength! > 0)) ? (
                  <Stack spacing={2} >
                     <Stack direction='row' justifyContent="center" alignItems="center" flexWrap="wrap" >
                        {(filteredProducts.length ? filteredProducts : prodDetails_new).map((prod: ProdDetailsTypes, index: number) => (
                           <ProductCard
                              key={index}

                              shopUrlName={shop?.urlName!}

                              prodId={prod.id}
                              prodName={prod.data().name}
                              prodImg={prod.data().imageUrl}
                              prodCategory={prod.data().category}
                              sellPrice={prod.data().sellPrice}
                           />
                        ))}
                     </Stack>
                     <Stack justifyContent="center" alignItems="center" >
                        {(!(category && (filteredProducts.length > 0)) && (prodDetails_new.length > 0)) && (
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
                  </Stack>
               ) : (
                  <Stack direction='row' justifyContent="center" alignItems="center" flexWrap="wrap" >
                     {[...Array(2)].map((_, index) => (
                        <Box key={index} p={1} >
                           <Skeleton
                              variant='rectangular'
                              animation="wave"
                              width="220px"
                              height="200px"
                              sx={{ borderRadius: 0.8 }}
                           />
                        </Box>
                     ))}
                  </Stack>
               )}
            </>
         ) : (
            <Typography variant="h6" component="p" textAlign="center" >Data is empty</Typography>
         )}
      </Stack>
   );


   return (
      <>
         <Head>
            <title>{shop ? shop.name : ((secure !== 404) ? 'Loading...' : '404')}</title>
            <meta name="description" content="" />
            <meta property="og:title" content={shop?.name} key="title" />
         </Head>

         <>
            {((secure === 'loading') && (
               <PageSkeleton_layout >
                  <Stack direction='row' justifyContent="center" alignItems="center" flexWrap="wrap" >
                     {[...Array(2)].map((_, index) => (
                        <Box key={index} p={1} >
                           <Skeleton
                              variant='rectangular'
                              animation="wave"
                              width="220px"
                              height="200px"
                              sx={{ borderRadius: 0.8 }}
                           />
                        </Box>
                     ))}
                  </Stack>
               </PageSkeleton_layout>
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

export default ShopHome;
