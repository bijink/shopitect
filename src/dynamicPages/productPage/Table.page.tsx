// *Product-table page
import { Button, capitalize, colors, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductTable from '../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signIn as signInProvider } from "next-auth/react";
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useShop } from '../../hooks';
import { selectProdSearchInput, setProdSearchInput } from '../../redux/slices/prodSearchInput.slice';
import { changeProdTableCollapse } from '../../redux/slices/prodTableCollapse.slice';
import Snackbars from '../../components/snackbars';
import { setAppPageId } from '../../redux/slices/pageId.slice';


const ProductTable_page = () => {
   const router = useRouter();
   const { shopAppUrl, category, page } = router.query;

   const dispatch = useAppDispatch();
   const searchInput_prod = useAppSelector(selectProdSearchInput);

   const { data: shop, secure } = useShop(shopAppUrl);

   const listLength = 10;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_new, setProdDetails_new] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState<null | number>(null);
   const [pageLength, setPageLength] = useState(1);


   // #create a new array by filtering the original array
   const filteredProducts = prodDetails.filter((obj: DocumentData) => {
      if (searchInput_prod !== '') {
         return obj.data().name.toLowerCase().includes(searchInput_prod);
      }
   });


   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('codeName')), (snapshot) => {
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
               router.push(`/${shopAppUrl}/product/table?page=${pageLength}`);
               pageInt = pageLength;
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shopAppUrl}/product/table?page=${'1'}`);
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
      (secure === 401) && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('productTable_page'));
   }, []);


   return (
      <>
         <Stack direction='row' spacing="auto" pb={2} >
            <Stack direction='row' alignItems="end" >
               <Typography variant="h5" component='p' >Product List</Typography>
               <Typography variant="subtitle2" component='p' pl={0.3} >{category && `[${capitalize(category.toString())}]`}</Typography>
            </Stack>
            <Button
               variant='contained'
               size="small"
               sx={{ bgcolor: 'primary.light' }}
               onClick={() => router.push(`/${shopAppUrl}/product/add`)}
            >
               Add
            </Button>
         </Stack>
         {((prodDocLength! > 0) || (prodDocLength === null)) ? (
            <>
               {((prodDocLength! > 0)) ? (
                  <Stack spacing={2} >
                     <ProductTable shopData={shop!} products={(filteredProducts.length ? filteredProducts : prodDetails_new)} />

                     <Stack direction='row' justifyContent="center" alignItems="center" >
                        {(!(category && (filteredProducts.length > 0)) && (prodDetails_new.length > 0)) && (
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
                  </Stack>
               ) : (
                  <Skeleton
                     variant="rectangular"
                     animation="wave"
                     width="100%"
                     height="4rem"
                     sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3, }}
                  />
               )}
            </>
         ) : (
            <Typography variant="h6" component="p" textAlign="center" >Data is empty</Typography>
         )}
         {<Snackbars />}
      </>
   );
};

export default ProductTable_page;
