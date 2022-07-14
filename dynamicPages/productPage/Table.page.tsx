// *Product-table page
import { Box, Button, colors, Skeleton, Stack, TablePagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import ProductTable from '../../components/productTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signIn as signInProvider } from "next-auth/react";
import { useShop } from '../../hooks';
import { changeProdTableCollapse } from '../../redux/slices/prodTableCollapse.slice';
import Snackbars from '../../components/snackbars';
import { setAppPageId } from '../../redux/slices/pageId.slice';
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { selectProdSearchInput } from '../../redux/slices/prodSearchInput.slice';


const ProductTable_page = () => {
   const router = useRouter();
   const { shopAppUrl, category } = router.query;

   const dispatch = useAppDispatch();
   const searchInput = useAppSelector(selectProdSearchInput);

   const { data: shop, secure } = useShop(shopAppUrl);


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
   // const [prodData_slice, setProdData_slice] = useState<DocumentData | null>(null);
   const [prodData_slice, setProdData_slice] = useState<DocumentData>([]);
   const [prodDataStatus, setProdDataStatus] = useState<boolean | 'loading'>('loading');

   const [sliceLg, setSliceLg] = useState(10);
   const [tablePage, setTablePage] = useState(0);


   const handleChangeTablePage = (
      event: MouseEvent<HTMLButtonElement> | null,
      newPage: number,
   ) => {
      setTablePage(newPage);
      dispatch(changeProdTableCollapse());
   };

   const handleChangeRowsPerPage = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      setSliceLg(parseInt(event.target.value, 10));
      setTablePage(0);
   };

   // #create a 2D array for prodData_slice's start&end points
   const getSlicePoints = (pageLength: number) => {
      let arr = [];
      for (let i = 1; i <= pageLength; i++) {
         arr.push([((i * sliceLg) - sliceLg), (i * sliceLg)]);
      }
      return arr;
   };


   // #all prodData
   useEffect(() => {
      shop && onSnapshot(query(collection(database, 'shops', shop.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
         setProdDataStatus(snapshot.docs.length ? true : false);
         setProdData(snapshot.docs);
         setProdDocLg({ ...prodDocLg, all: snapshot.docs.length });

      });
   }, [shop]);
   // #search & category prodData
   useEffect(() => {
      if (Boolean(searchInput)) {
         setTablePage(0);
         const searchFilter: Array<DocumentData> = prodData.filter((obj: DocumentData) => obj.data().name.toLowerCase().includes(searchInput.toLowerCase()));
         setProdDocLg({ ...prodDocLg, search: searchFilter.length });
         setProdData_filtered(searchFilter);
      } else if (Boolean(category)) {
         setTablePage(0);
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
      let pageInt: number = tablePage;

      const slicePoints: number[][] = getSlicePoints(pageLg!);

      // #to get prodData_slice according to tablePagination
      if (pageLg) {
         if ((prodDocLg.search === null) && (prodDocLg.category === null) && (prodData.length > 0)) {
            try {
               setProdData_slice(prodData.slice(slicePoints[pageInt][0], slicePoints[pageInt][1]));
            } catch (error: any) {
               console.error('TableError:', error.message);
            }
         } else if (((prodDocLg.category !== null) || (prodDocLg.search !== null)) && (prodData_filtered.length > 0)) {
            try {
               setProdData_slice(prodData_filtered.slice(slicePoints[pageInt][0], slicePoints[pageInt][1]));
            } catch (error: any) {
               console.error('TableError:', error.message);
            }
         }
      }
   }, [tablePage, pageLg, prodDocLg, prodData, prodData_filtered]);


   useEffect(() => {
      (secure === 401) && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   }, [secure]);

   useEffect(() => {
      dispatch(setAppPageId('productTable_page'));
   }, []);


   return (
      <>
         <Stack direction='row' spacing="auto" pb={2} >
            <Typography variant="h5" component='p' >Product List</Typography>
            <Button
               variant='contained'
               size="small"
               color="secondary"
               onClick={() => router.push(`/${shopAppUrl}/product/add`)}
            >
               Add
            </Button>
         </Stack>

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
                        <Box>
                           <ProductTable shopData={shop!} products={prodData_slice!} />

                           <Stack direction='row' justifyContent="end" alignItems="center" >
                              <TablePagination
                                 component="div"
                                 count={
                                    ((prodDocLg.search === null) && (prodDocLg.category === null))
                                       ? prodData.length
                                       : prodData_filtered.length
                                 }
                                 page={tablePage}
                                 onPageChange={handleChangeTablePage}
                                 rowsPerPage={sliceLg}
                                 onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                           </Stack>
                        </Box>
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
                        <Skeleton
                           variant="rectangular"
                           animation="wave"
                           width="100%"
                           height="4rem"
                           sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3, }}
                        />

                     )}
                  </>
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
