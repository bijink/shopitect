import Head from "next/head";
import { useRouter } from "next/router";
import { useShop } from "../../hooks";

const ShopPagesHead = ({ title = '' }: { title: string; }) => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const { data: shop, secure } = useShop(shopAppUrl);

   return (
      <Head>
         <title>{shop ? `${title} · ${shop.name}` : ((secure !== 404) ? 'Loading...' : '404')}</title>
         {/* <meta name="description" content="" /> */}
         <meta property="og:title" content={shop?.name} key="title" />
      </Head>
   );
};

export default ShopPagesHead;
