module.exports = {
   reactStrictMode: true,
   images: {
      domains: ["firebasestorage.googleapis.com"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
