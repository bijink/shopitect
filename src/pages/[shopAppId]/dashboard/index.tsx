// *Dashboard page
import type { NextPage } from 'next';

import { Button, capitalize, CircularProgress, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAppPageId } from '../../../redux/slices/pageId.slice';
import { PageLoading_layout, ShopAdmin_layout } from '../../../layouts';
import { signIn as signInProvider } from "next-auth/react";
import { selectShopDetails } from '../../../redux/slices/shopDetails.slice';
import Forbidden from '../../403';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../../config/firebase.config';
import NotFound from '../../404';
import { useSecurePage } from '../../../hooks';
import ShopPagesHead from '../../../components/shopPagesHead';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { selectProdSearchInput, setProdSearchInput } from '../../../redux/slices/prodSearchInput.slice';
import { changeProdTableCollapse } from '../../../redux/slices/prodTableCollapse.slice';


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppId, category, page } = router.query;
   // console.log(category);
   // console.log(page);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   const searchInput_prod = useAppSelector(selectProdSearchInput);
   // console.log(searchInput_prod);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const listLength = 10;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_category, setProdDetails_category] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState(0);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);
   // const [pageNoInput, setPageNoInput] = useState<number | string>(1);


   //create a new array by filtering the original array
   const filteredProducts = prodDetails.filter((obj: DocumentData) => {
      if (searchInput_prod !== '') {
         return obj.data().name.toLowerCase().includes(searchInput_prod);
      }
   });


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('codeName')), (snapshot) => {
         setProdDetails(snapshot.docs);
         // setProdDocLength(prodDetails.length);
      });
   }, [database, shop]);

   useEffect(() => {
      setProdDocLength(prodDetails.length);

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
            for (let i = 1; i <= (Math.ceil(prodDocLength / listLength)); i++) {
               arr.push([((i * listLength) - listLength), (i * listLength)]);
            }

            // #to catch and solve page breaking due to unmatchable page number
            if ((parseInt(page.toString()) > arr.length)) {
               router.push(`/${shop.data?.urlName}/dashboard?page=${Math.ceil(prodDocLength / listLength)}`);
               pageInt = (Math.ceil(prodDocLength / listLength));
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shop.data?.urlName}/dashboard?page=${'1'}`);
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
   }, [database, category, prodDetails, page, prodDocLength, searchInput_prod]);

   useEffect(() => {
      (secure === '401') && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Dashboard" />

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || (((secure === '200') && shop && prodDetails) && (
            <ShopAdmin_layout>
               <>
                  <Stack direction='row' spacing="auto" pb={2} alignItems="center" >
                     <Stack direction='row' spacing="auto" alignItems="end" >
                        <Typography variant="h4" component='p' >Product List</Typography>
                        <Typography variant="subtitle2" component='p' pl={0.3} >{category && `[${capitalize(category.toString())}]`}</Typography>
                     </Stack>
                     <Button
                        variant='contained'
                        onClick={() => router.push(`/${shopAppId}/dashboard/product&add`)}
                     >
                        Add
                     </Button>
                  </Stack>
                  {(prodDocLength > 0) ?
                     <>
                        <ProductTable shopData={shop.data} products={(filteredProducts.length ? filteredProducts : prodDetails_category)} />
                        <Stack direction='row' spacing={1} pt={2} justifyContent="center" alignItems="center" >
                           {(!category && !(filteredProducts.length > 0)) && (
                              <Pagination
                                 count={Math.ceil(prodDocLength / listLength)}
                                 page={page ? (parseInt(page.toString())) : 1}
                                 onChange={(_, value: number) => {
                                    router.push(`/${shop.data?.urlName}/dashboard?page=${value}`);
                                    dispatch(changeProdTableCollapse());
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
               </>
            </ShopAdmin_layout>
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Dashboard;
