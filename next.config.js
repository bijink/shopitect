module.exports = {
   reactStrictMode: true,
   images: {
      domains: ["firebasestorage.googleapis.com"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
   },
   env: {
      secretAccessCode_myShop: process.env.MYSHOP_SECRET_ACCESS_CODE,
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
      nextSecret: process.env.NEXTAUTH_SECRET,
   },
   redirects: async () => {
      return [
         {
            source: '/auth',
            destination: '/',
            permanent: true,
         },
         {
            source: '/:shopAppUrl/product',
            destination: '/:shopAppUrl/product/table',
            permanent: true,
         },
      ];
   },
};
