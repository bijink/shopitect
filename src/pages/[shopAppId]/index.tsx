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
import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import NotFound from '../404';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';


const Shop: NextPage = () => {
   const router = useRouter();
   const { shopAppId, category, page } = router.query;
   // console.log(shopAppId);

   const dispatch = useAppDispatch();
   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const listLength = 15;
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDetails_category, setProdDetails_category] = useState<DocumentData>([]);
   const [fetchDelayOver, setFetchDelayOver] = useState(false);
   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);
   const [prodDocLength, setProdDocLength] = useState(0);
   const [pageNoInput, setPageNoInput] = useState<number | string>(1);


   useEffect(() => {
      (shop?.data) && onSnapshot(query(collection(database, 'shops', shop.data?.urlName, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
         setProdDetails(snapshot.docs);
         setProdDocLength(prodDetails.length);
      });
   }, [database, shop]);

   useEffect(() => {
      setProdDocLength(prodDetails.length);

      if (category) {
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
               router.push(`/${shop.data?.urlName}?page=${Math.ceil(prodDocLength / listLength)}`);
               pageInt = (Math.ceil(prodDocLength / listLength));
            } else if ((parseInt(page.toString()) < 1) || (isNaN(parseInt(page.toString())))) {
               router.push(`/${shop.data?.urlName}?page=${'1'}`);
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
   }, [database, category, prodDetails, page, prodDocLength]);

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
                  <Stack direction={'column'} >
                     {(prodDocLength > 0) ?
                        <>
                           <Stack direction={'row'} justifyContent="center" alignItems="center" flexWrap="wrap" >
                              {prodDetails_category.map((prod: ProdDetailsTypes, index: number) => (
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
                           <Stack direction='row' spacing={1} pt={2} justifyContent="center" alignItems="center" >
                              {!category && (
                                 <>
                                    <Button
                                       variant='outlined'
                                       size='small'
                                       onClick={() => {
                                          page && router.push(`/${shop.data?.urlName}?page=${parseInt(page.toString()) - 1}`);
                                       }}
                                       disabled={!(page && (parseInt(page.toString()) > 1))}
                                    >prev</Button>

                                    <PopupState variant="popover" popupId="demo-popup-popover">
                                       {(popupState) => (
                                          <div>
                                             <Typography sx={{ "&:hover": { cursor: "pointer" } }} {...bindTrigger(popupState)} >Page No: {page ? parseInt(page.toString()) : '1'}/{Math.ceil(prodDocLength / listLength)}</Typography>
                                             <Popover
                                                {...bindPopover(popupState)}
                                                anchorOrigin={{
                                                   vertical: 'bottom',
                                                   // vertical: 'center',
                                                   horizontal: 'center',
                                                }}
                                                transformOrigin={{
                                                   vertical: 'top',
                                                   // vertical: 'center',
                                                   horizontal: 'center',
                                                }}
                                             >
                                                <form onSubmit={(e: any) => {
                                                   e.preventDefault();
                                                   ((pageNoInput <= 0)
                                                      ? router.push(`/${shop.data?.urlName}`)
                                                      : ((pageNoInput > (Math.ceil(prodDocLength / listLength)))
                                                         ? router.push(`/${shop.data?.urlName}?page=${Math.ceil(prodDocLength / listLength)}`)
                                                         : router.push(`/${shop.data?.urlName}?page=${pageNoInput}`)
                                                      )
                                                   );
                                                }}>
                                                   <TextField
                                                      size='small'
                                                      type="number"
                                                      sx={{ width: '5rem' }}
                                                      value={pageNoInput}
                                                      onInput={(e: any) => setPageNoInput(e.target.value)}
                                                      onBlur={() => {
                                                         ((pageNoInput <= 0)
                                                            ? router.push(`/${shop.data?.urlName}`).then(() => setPageNoInput(''))
                                                            : ((pageNoInput > (Math.ceil(prodDocLength / listLength)))
                                                               ? router.push(`/${shop.data?.urlName}?page=${Math.ceil(prodDocLength / listLength)}`).then(() => setPageNoInput(''))
                                                               : router.push(`/${shop.data?.urlName}?page=${pageNoInput}`).then(() => setPageNoInput(''))
                                                            )
                                                         );
                                                      }}
                                                   />
                                                </form>
                                             </Popover>
                                          </div>
                                       )}
                                    </PopupState>

                                    <Button
                                       variant='outlined'
                                       size='small'
                                       onClick={() => {
                                          page
                                             ? router.push(`/${shop.data?.urlName}?page=${parseInt(page.toString()) + 1}`)
                                             : router.push(`/${shop.data?.urlName}?page=2`);
                                       }}
                                       disabled={(page && !((parseInt(page.toString())) < (Math.ceil(prodDocLength / listLength)))) || ((Math.ceil(prodDocLength / listLength)) === 1) || false}
                                    >next</Button>
                                 </>
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
