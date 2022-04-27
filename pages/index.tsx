import type { NextPage } from 'next';
import Head from 'next/head';
import ProductCard from '../components/productCard';
import _publicSectionLayout_ from '../layouts/PublicSection.layout';


const Home: NextPage = () => {
   return (
      <>
         <Head>
            <title>master-project-app</title>
            <meta name="description" content="" />
         </Head>

         <_publicSectionLayout_>
            <ProductCard />
         </_publicSectionLayout_>
      </>
   );
};

export default Home;
