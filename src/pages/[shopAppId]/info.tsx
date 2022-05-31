import type { NextPage } from "next";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShopPagesHead from "../../components/shopPagesHead";
import { useSecurePage } from "../../hooks";
import { PageLoading_layout, Public_layout } from "../../layouts";
import { useAppDispatch } from "../../redux/hooks";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import NotFound from "../404";
import { capitalize } from "@mui/material";
import { About_tab, Admin_tab } from "../../components/pageTabs/infoPage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";


const Info: NextPage = () => {
   const router = useRouter();
   const { shopAppId, tab } = router.query;
   // console.log(tab);

   const dispatch = useAppDispatch();

   const secure = useSecurePage(shopAppId);
   // console.log(secure);

   const [shopNotExistOnServer, setShopNotExistOnServer] = useState(false);


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
      dispatch(setAppPageId('info_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Info" />
         {/* <ShopPagesHead title={capitalize(tab)} /> */}

         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || (((secure === '200') || (secure === '404') || shopNotExistOnServer) && (
            <NotFound />
         )) || (((secure === '401') || (secure === '403')) && (
            <Public_layout>
               {
                  ((!tab) && <About_tab />)
                  ||
                  ((tab === 'about') && <About_tab />)
                  ||
                  ((tab === 'admin') && <Admin_tab />)
               }
            </Public_layout>
         ))}
      </>
   );
};

export default Info;
