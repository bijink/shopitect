// *info page
import type { NextPage } from "next";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShopPagesHead from "../../../components/shopPagesHead";
import { useShop } from "../../../hooks";
import { PageSkeleton_layout, Page_layout } from "../../../layouts";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import NotFound from "../../404";
import { About_page, Admin_page } from "../../../dynamicPages/infoPage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import { Public_navBar } from "../../../components/navBar";
import { Public_sideBar } from "../../../components/sideBar";


const InfoPages: NextPage = () => {
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
   }, [database, shopAppUrl]);

   useEffect(() => {
      dispatch(setAppPageId('info_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Info" />

         {((secure === 'loading') && (
            <PageSkeleton_layout />
         )) || ((!((infoPages === 'about') || (infoPages === 'admin'))
            || ((secure === 200) || (secure === 404) || shopNotExistOnServer)) && (
               <NotFound />
            )) || (((secure === 401) || (secure === 403)) && (
               <Page_layout navbar={<Public_navBar />} sidebar={<Public_sideBar />} >
                  {
                     ((infoPages === 'about') && <About_page shopData={shop!} />)
                     ||
                     ((infoPages === 'admin') && <Admin_page />)
                  }
               </Page_layout>
            ))}
      </>
   );
};

export default InfoPages;
