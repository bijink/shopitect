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


interface MyAppProps extends AppProps {
   emotionCache?: EmotionCache;
}


const clientSideEmotionCache = createEmotionCache();
const theme = createTheme(customTheme);


const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
   const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;

   return (
      <>
         <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
