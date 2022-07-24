// *shopApp homePage
import type { NextPage } from 'next';
import type { ProdDetailsTypes } from '../../types/pages/shopHomePage.types';

import Head from 'next/head';
import { collection, onSnapshot, query, where, DocumentData, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard';
import { database } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import { PageSkeleton_layout, Page_layout } from '../../layouts';
import { useShop, useUser } from '../../hooks';
import { Box, colors, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import NotFound from '../404';
import { selectProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { Public_navBar, ShopAdmin_navBar } from '../../components/navBar';
import { Public_sideBar, ShopAdmin_sideBar } from '../../components/sideBar';
import { Public_btmNavbar, ShopAdmin_btmNavbar } from '../../components/bottomNavBar';


const ShopHome: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, category, page } = router.query;

   const dispatch = useAppDispatch();
   const searchInput = useAppSelector(selectProdSearchInput);

   const { status } = useUser();
   const { data: shop, secure } = useShop(shopAppUrl);

   const sliceLg = 10;
   const [prodDocLg, setProdDocLg] = useState<{
      all: number,
      search: number | null,
      category: number | null,
   }>({
      all: 0,
      search: null,
      category: null,
   });
   const [pageLg, setPageLg] = useState<number | null>(null);
   const [prodData, setProdData] = useState<DocumentData>([]);
   const [prodData_filtered, setProdData_filtered] = useState<DocumentData>([]);
   const [prodData_slice, setProdData_slice] = useState<DocumentData>([]);
   const [prodDataStatus, setProdDataStatus] = useState<boolean | 'loading'>('loading');

   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);


   // #create a 2D array for prodData_slice's start&end points
   const getSlicePoints = (pageLength: number) => {
      let arr = [];
      for (let i = 1; i <= pageLength; i++) {
         arr.push([((i * sliceLg) - sliceLg), (i * sliceLg)]);
      }
      return arr;
   };


   useEffect(() => {
      let secretAccessCode = sessionStorage.getItem('secret-access-code');

      if (!secretAccessCode && (status === 'unauthenticated') && (shopAppUrl === 'my-shop')) {
         let hasSecretAccessCode = confirm('Click OK if you have the "Secret Access Code"');

         if (hasSecretAccessCode) {
            let promptValue = prompt('Enter the "Secret Access Code" to get the admin control without login : ');
            if (promptValue === process.env.secretAccessCode_myShop) {
               sessionStorage.setItem('secret-access-code', JSON.stringify(promptValue));
            } else if ((promptValue !== null) && (promptValue !== process.env.secretAccessCode_myShop)) {
               alert('Wrong Access Code');
            }
         }
      }
   }, [status]);

   // #all prodData
   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
         setProdData(snapshot.docs);
         setProdDocLg({ ...prodDocLg, all: snapshot.docs.length });

         setProdDataStatus(snapshot.docs.length ? true : false);
      });
   }, [shop]);
   // #search & category prodData
   useEffect(() => {
      if (Boolean(searchInput)) {
         const searchFilter: Array<DocumentData> = prodData.filter((obj: DocumentData) => obj.data().name.toLowerCase().includes(searchInput.toLowerCase()));
         setProdDocLg({ ...prodDocLg, search: searchFilter.length });
         setProdData_filtered(searchFilter);
      } else if (Boolean(category)) {
         const categoryFilter: Array<DocumentData> = prodData.filter((obj: DocumentData) => obj.data().category === category);
         setProdDocLg({ ...prodDocLg, category: categoryFilter.length });
         setProdData_filtered(categoryFilter);
      } else {
         setProdDocLg({ ...prodDocLg, search: null, category: null });
      }
   }, [prodData, searchInput, category]);

   // #pageLg
   useEffect(() => {
      if ((prodDocLg.search === null) && (prodDocLg.category === null)) {
         setPageLg(Math.ceil(prodDocLg.all / sliceLg));
      } else if (prodDocLg.search !== null) {
         setPageLg(Math.ceil(prodDocLg.search / sliceLg));
      } else if (prodDocLg.category !== null) {
         setPageLg(Math.ceil(prodDocLg.category / sliceLg));
      }
   }, [prodDocLg, sliceLg]);

   // #prodData_slice
   useEffect(() => {
      let pageInt: number;
      const slicePoints = getSlicePoints(pageLg!);

      if ((prodDocLg.search === null) && (prodDocLg.category === null) && (prodData.length > 0)) {
         // console.log('all');
         if (page && pageLg) {
            // #to catch and solve app breaking if an unmatchable page number exist on url
            if ((parseInt(page.toString()) > slicePoints.length)) {
               router.push(`/${shopAppUrl}?page=${pageLg}`);
               pageInt = pageLg;
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shopAppUrl}?page=${'1'}`);
               pageInt = 1;
            } else {
               pageInt = parseInt(page.toString());
            }

            // #to get prodData_slice according to page number
            setProdData_slice(prodData.slice(slicePoints[pageInt - 1][0], slicePoints[pageInt - 1][1]));
         }
         else {
            // #to get prodData_slice for initial render or if no page exist on url
            setProdData_slice(prodData.slice(0, sliceLg));
         }
      } else if ((prodDocLg.category !== null) && (prodData_filtered.length > 0)) {
         // console.log('category');
         if (page && pageLg) {
            if ((parseInt(page.toString()) > slicePoints.length)) {
               router.push(`/${shopAppUrl}?category=${category}&page=${pageLg}`);
               pageInt = pageLg;
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shopAppUrl}?category=${category}&page=${'1'}`);
               pageInt = 1;
            } else {
               pageInt = parseInt(page.toString());
            }

            setProdData_slice(prodData_filtered.slice(slicePoints[pageInt - 1][0], slicePoints[pageInt - 1][1]));
         } else {
            setProdData_slice(prodData_filtered.slice(0, sliceLg));
         }
      } else if ((prodDocLg.search !== null) && (prodData_filtered.length > 0)) {
         // console.log('search');
         if (page && pageLg) {
            pageInt = parseInt(page.toString());

            setProdData_slice(prodData_filtered.slice(slicePoints[pageInt - 1][0], slicePoints[pageInt - 1][1]));
         }
         else {
            setProdData_slice(prodData_filtered.slice(0, sliceLg));
         }
      }
   }, [router, shopAppUrl, prodData, prodData_filtered, page, pageLg, prodDocLg, category]);


   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
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
   }, [shopAppUrl]);

   useEffect(() => {
      dispatch(setAppPageId('shopHome_page'));
   }, [dispatch]);


   const ProductCardWrap = () => (
      <Stack direction='column' >
         {/* #if prodDataStatus == true | 'loading' */}
         {(prodDataStatus) ? (
            <>
               {((prodData_slice?.length > 0)) ? (
                  <Stack spacing={2} >
                     {((prodDocLg.search !== null) && searchInput) && (
                        <Stack direction="row" alignItems="start" spacing={0.7} >
                           <Typography>Search for</Typography>
                           <Typography
                              px={1.2}
                              sx={{ bgcolor: colors.grey[300], borderRadius: 8, }}
                           >
                              {searchInput}
                           </Typography>
                        </Stack>
                     )}
                     {((prodDocLg.category !== null) && category) && (
                        <Stack direction="row" alignItems="start" spacing={0.7} >
                           <Typography>Category for</Typography>
                           <Typography
                              px={1.2}
                              sx={{ bgcolor: colors.grey[300], borderRadius: 8, }}
                           >
                              {category}
                           </Typography>
                        </Stack>
                     )}
                     {(prodDocLg?.search === 0) ? (
                        <Typography variant="h6" component="p" fontWeight={300} textAlign="center" >No result found !</Typography>
                     ) : (
                        <>
                           <Stack direction='row' justifyContent="center" alignItems="center" flexWrap="wrap" >
                              {prodData_slice?.map((prod: ProdDetailsTypes, index: number) => (
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
                              <Pagination
                                 size="small"
                                 boundaryCount={1}
                                 // showFirstButton={page ? (page?.toString() !== '1') : false}
                                 // showLastButton={page?.toString() !== pageLg?.toString()}
                                 count={pageLg!}
                                 page={page ? (parseInt(page.toString())) : 1}
                                 onChange={(_, value: number) => {
                                    category
                                       ? router.push(`/${shopAppUrl}?category=${category}&page=${value}`)
                                       : router.push(`/${shopAppUrl}?page=${value}`);
                                 }}
                              />
                           </Stack>
                        </>
                     )}
                  </Stack>
               ) : (
                  <>
                     {(category) ? (
                        <Stack spacing={2} >
                           <Stack direction="row" alignItems="start" spacing={0.7} >
                              <Typography>Category for</Typography>
                              <Typography
                                 px={1.2}
                                 sx={{ bgcolor: colors.grey[300], borderRadius: 8, }}
                              >
                                 {category}
                              </Typography>
                           </Stack>
                        </Stack>
                     ) : (
                        <Stack direction='row' justifyContent="center" alignItems="center" flexWrap="wrap" >
                           {[...Array(2)].map((_, index) => (
                              <Box key={index} p={1} >
                                 <Skeleton
                                    variant='rectangular'
                                    animation="wave"
                                    sx={{
                                       borderRadius: 0.8,
                                       width: { xs: "120px", sm: "220px" },
                                       height: { xs: "140px", sm: "200px" }
                                    }}
                                 />
                              </Box>
                           ))}
                        </Stack>
                     )}
                  </>
               )}
            </>
         ) : (
            <Typography variant="h6" component="p" textAlign="center" >Data is empty</Typography>
         )}
      </Stack >
   );


   return (
      <>
         <Head>
            <title>{shop ? shop.name : ((secure !== 404) ? 'Loading...' : '404')}</title>
            <meta name="description" content={shop?.category} />
            <meta property="og:title" content={shop?.name} key="title" />
            <link rel="icon" type="image/*" href={shop ? shop.logoUrl : '/img/loading-blank-logo.png'} />
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
                              sx={{
                                 borderRadius: 0.8,
                                 width: { xs: "120px", sm: "220px" },
                                 height: { xs: "140px", sm: "200px" }
                              }}
                           />
                        </Box>
                     ))}
                  </Stack>
               </PageSkeleton_layout>
            )) || ((secure === 200) && (
               <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<ShopAdmin_sideBar />} btmNavbar={<ShopAdmin_btmNavbar />} >
                  <ProductCardWrap />
               </Page_layout>
            )) || (((secure === 404) || shopNotExistOnServer) && (
               <NotFound />
            )) || (((secure === 401) || (secure === 403)) && (
               <Page_layout navbar={<Public_navBar />} sidebar={<Public_sideBar />} btmNavbar={<Public_btmNavbar />} >
                  <ProductCardWrap />
               </Page_layout>
            ))}
         </>
      </>
   );
};

export default ShopHome;
