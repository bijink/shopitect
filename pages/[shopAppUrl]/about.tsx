// *about page
import { Typography, colors, Stack, Box } from "@mui/material";
import type { NextPage } from "next";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useShop } from "../../hooks";
import { useAppDispatch } from "../../redux/hooks";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import ShopPagesHead from "../../components/shopPagesHead";
import { PageSkeleton_layout, Page_layout } from "../../layouts";
import NotFound from "../404";
import { Public_navBar } from "../../components/navBar";
import { Public_sideBar } from "../../components/sideBar";
import { Public_btmNavbar } from "../../components/bottomNavBar";


const About: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, infoPages } = router.query;

   const dispatch = useAppDispatch();

   const { data: shop, secure } = useShop(shopAppUrl);

   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);


   // #removing sessionStorage when shopAppUrl not exist on server data
   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         // console.log(snapshot.docs.length);
         if (snapshot.docs.length == 0) {
            setShopNotExistOnServer(true);
            sessionStorage.removeItem('shop-details');
         }
      });
   }, [shopAppUrl]);

   useEffect(() => {
      dispatch(setAppPageId('about_page'));
   }, [dispatch]);


   return (
      <>
         <ShopPagesHead title="Info" />

         {((secure === 'loading') && (
            <PageSkeleton_layout />
         )) || ((((secure === 200) || (secure === 404) || shopNotExistOnServer)) && (
            <NotFound />
         )) || (((secure === 401) || (secure === 403)) && (
            <Page_layout navbar={<Public_navBar />} sidebar={<Public_sideBar />} btmNavbar={<Public_btmNavbar />} >
               <Typography variant="h5" component="p" gutterBottom >About Us</Typography>

               {(shop) && (
                  <>
                     <Typography variant="h6" component="p" >{shop.name} - {shop.category}</Typography>
                     <Typography variant="subtitle2" component="p" pb={2} fontWeight="800" color={colors.grey[700]} >Owned by: {shop.ownerName}</Typography>
                     {shop.about && (
                        <Stack direction="column" pb={2} >
                           {shop.about.split('\n').map((str: string, index: number) => (
                              <Typography key={index} variant="body2" component="p" >{str}</Typography>
                           ))}
                        </Stack>
                     )}
                     <Box>
                        {shop.address && shop.address.split('\n').map((str: string, index: number) => (
                           <Typography key={index} variant="subtitle2" component="p" >{str}</Typography>
                        ))}
                     </Box>
                  </>
               )}
            </Page_layout>
         ))}
      </>
   );
};

export default About;
