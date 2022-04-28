import type { NextPage } from 'next';
import Head from 'next/head';
import ProductCard from '../../components/productCard';
import PublicSection_layout from '../../layouts/PublicSection.layout';


const Shop: NextPage = () => {
   return (
      <>
         <Head>
            <title>shopName</title>
            <meta name="description" content="" />
         </Head>
         <PublicSection_layout>
            <ProductCard />
         </PublicSection_layout>
      </>
   );
};

export default Shop;
