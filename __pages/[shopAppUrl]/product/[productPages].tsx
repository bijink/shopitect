// *product page
import type { NextPage } from 'next';

import { useRouter } from 'next/router';
import ShopPagesHead from '../../../__components/shopPagesHead';
import { useShop } from '../../../__hooks';
import { PageSkeleton_layout, Page_layout } from '../../../__layouts';
import Forbidden from '../../403';
import NotFound from '../../404';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../__redux/hooks';
import { setAppPageId } from '../../../__redux/slices/pageId.slice';
import {
  ProductAdd_page,
  ProductTable_page,
  ProductView_page,
} from '../../../__dynamicPages/productPage';
import { Public_navBar, ShopAdmin_navBar } from '../../../__components/navBar';
import { Public_sideBar, ShopAdmin_sideBar } from '../../../__components/sideBar';
import { Public_btmNavbar, ShopAdmin_btmNavbar } from '../../../__components/bottomNavBar';

const ProductPages: NextPage = () => {
  const router = useRouter();
  const { shopAppUrl, productPages } = router.query;

  const dispatch = useAppDispatch();

  const { secure } = useShop(shopAppUrl);

  useEffect(() => {
    dispatch(setAppPageId('product_page'));
  }, [dispatch]);

  return (
    <>
      <ShopPagesHead title="Product" />

      {(secure === 'loading' && <PageSkeleton_layout />) ||
        ((secure === 404 ||
          !(productPages === 'table' || productPages === 'add' || productPages === 'view')) && (
          <NotFound />
        )) ||
        (secure === 200 && (
          <Page_layout
            navbar={<ShopAdmin_navBar />}
            sidebar={<ShopAdmin_sideBar />}
            btmNavbar={<ShopAdmin_btmNavbar />}
          >
            {(productPages === 'table' && <ProductTable_page />) ||
              (productPages === 'add' && <ProductAdd_page />) ||
              (productPages === 'view' && <ProductView_page />)}
          </Page_layout>
        )) ||
        ((secure === 401 || secure === 403) &&
          (productPages === 'view' ? (
            <Page_layout
              navbar={<Public_navBar />}
              sidebar={<Public_sideBar />}
              btmNavbar={<Public_btmNavbar />}
            >
              <ProductView_page />
            </Page_layout>
          ) : (
            <Forbidden />
          )))}
    </>
  );
};

export default ProductPages;
