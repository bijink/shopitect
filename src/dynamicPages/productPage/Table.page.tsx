// *Product-table page
import { Button, capitalize, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signIn as signInProvider } from "next-auth/react";
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useSecurePage } from '../../hooks';
import { selectProdSearchInput, setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { changeProdTableCollapse } from '../../redux/slices/prodTableCollapse.slice';
import Snackbars from '../../components/snackbars';


const ProductTable_page = () => {
   const router = useRouter();
   const { shopAppUrl, category, page } = router.query;
   // console.log(category);
   // console.log(page);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);
   const searchInput_prod = useAppSelector(selectProdSearchInput);
   // console.log(searchInput_prod);

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);

   const listLength = 10;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_category, setProdDetails_category] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState(0);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);
   const [pageLength, setPageLength] = useState(1);


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
               router.push(`/${shopAppUrl}/product/table?page=${pageLength}`);
               pageInt = pageLength;
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shopAppUrl}/product/table?page=${'1'}`);
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
      (secure === 401) && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);


   return (
      <>
         <Stack direction='row' spacing="auto" pb={2} alignItems="center" >
            <Stack direction='row' spacing="auto" alignItems="end" >
               <Typography variant="h5" component='p' gutterBottom >Product List</Typography>
               <Typography variant="subtitle2" component='p' pl={0.3} >{category && `[${capitalize(category.toString())}]`}</Typography>
            </Stack>
            <Button
               variant='contained'
               size="small"
               onClick={() => router.push(`/${shopAppUrl}/product/add`)}
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
                        count={pageLength}
                        page={page ? (parseInt(page.toString())) : 1}
                        onChange={(_, value: number) => {
                           router.push(`/${shopAppUrl}/product/table?page=${value}`);
                           dispatch(changeProdTableCollapse());
                        }}
                        showFirstButton showLastButton
                     />
                  )}
               </Stack>
            </>
            :
            <>
               {(fetchDelayOver)
                  ? <Typography variant="h5" component="p" textAlign="center" >No Products</Typography>
                  : (
                     <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width="100%"
                        height="50vh"
                        sx={{ borderRadius: 1 }}
                     />
                  )
               }
            </>
         }
         {<Snackbars />}
      </>
   );
};

export default ProductTable_page;
