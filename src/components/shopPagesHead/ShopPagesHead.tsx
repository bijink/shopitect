import Head from "next/head";
import { useRouter } from "next/router";
import { useSecurePage } from "../../hooks";
import { useAppSelector } from "../../redux/hooks";
import { selectShopDetails } from "../../redux/slices/shopDetails.slice";

const ShopPagesHead = ({ title = '' }: { title: string; }) => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const shop = useAppSelector(selectShopDetails);

   const secure = useSecurePage(shopAppUrl);
   // console.log(secure);


   return (
      <Head>
         <title>{shop?.data ? `${title} · ${shop.data.name}` : ((secure !== 404) ? 'Loading...' : '404')}</title>
         {/* <meta name="description" content="" /> */}
         <meta property="og:title" content={shop?.data?.name} key="title" />
      </Head>
   );
};

export default ShopPagesHead;
