import Head from "next/head";

const Forbidden = () => {
   return (
      <>
         <Head>
            <title>403 · No Access </title>
            <link rel="icon" type="image/webp" href="/img/403-logo.webp" />
         </Head>

         <div>403 You have no access to this page</div>
      </>

   );
};
export default Forbidden;