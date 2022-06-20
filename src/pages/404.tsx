import Head from 'next/head';

const NotFound = () => {
   return (
      <>
         <Head>
            <title>404 · Page Not Found</title>
            <link rel="icon" type="image/webp" href="/img/404-logo.webp" />
         </Head>

         <div>404 Page Not Found</div>
      </>
   );
};

export default NotFound;
