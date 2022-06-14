import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createEmotionCache from '../utility/createEmotionCache';
import '../styles/globals.css';
import customTheme from '../styles/customTheme';

import { Provider } from 'react-redux';
import { store } from '../redux/store';

import { SessionProvider } from "next-auth/react";
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import '../styles/nprogress.css';


interface MyAppProps extends AppProps {
   emotionCache?: EmotionCache;
}


const clientSideEmotionCache = createEmotionCache();
const theme = createTheme(customTheme);


const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
   const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;

   NProgress.configure({ showSpinner: false });
   Router.events.on('routeChangeStart', () => {
      NProgress.start();
   });
   Router.events.on('routeChangeComplete', () => {
      NProgress.done();
   });


   return (
      <>
         <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
         </Head>

         <SessionProvider session={session}>
            <Provider store={store}>
               <CacheProvider value={emotionCache}>
                  <ThemeProvider theme={theme}>
                     <CssBaseline />
                     <Component {...pageProps} />
                  </ThemeProvider>
               </CacheProvider>
            </Provider>
         </SessionProvider>
      </>
   );
};

export default MyApp;
