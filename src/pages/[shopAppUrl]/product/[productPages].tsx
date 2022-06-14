// *product page
import type { NextPage } from "next";

import { useRouter } from "next/router";
import ShopPagesHead from "../../../components/shopPagesHead";
import { useSecurePage } from "../../../hooks";
import { PageSkeleton_layout, Page_layout } from "../../../layouts";
import Forbidden from "../../403";
import NotFound from "../../404";
import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import { ProductAdd_page, ProductTable_page, ProductView_page } from "../../../dynamicPages/productPage";
import { Public_navBar, ShopAdmin_navBar } from "../../../components/navBar";
import { Public_sideBar, ShopAdmin_sideBar } from "../../../components/sideBar";


const ProductPages: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, productPages } = router.query;

   const dispatch = useAppDispatch();

   const secure = useSecurePage(shopAppUrl);


   useEffect(() => {
      dispatch(setAppPageId('product_page'));
   }, []);


   return (
      <>
         <ShopPagesHead title="Product" />

         {((secure === 'loading') && (
            <PageSkeleton_layout />
         )) || (((secure === 404)
            || !((productPages === 'table') || (productPages === 'add') || (productPages === 'view'))) && (
               <NotFound />
            )) || ((secure === 200) && (
               <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<ShopAdmin_sideBar />} >
                  {
                     ((productPages === 'table') && <ProductTable_page />)
                     ||
                     ((productPages === 'add') && <ProductAdd_page />)
                     ||
                     ((productPages === 'view') && <ProductView_page />)
                  }
               </Page_layout>
            )) || (((secure === 401) || (secure === 403)) && (
               ((productPages === 'view') ? (
                  <Page_layout navbar={<Public_navBar />} sidebar={<Public_sideBar />} >
                     <ProductView_page />
                  </Page_layout>
               ) : (
                  <Forbidden />
               ))
            ))}
      </>
   );
};

export default ProductPages;
