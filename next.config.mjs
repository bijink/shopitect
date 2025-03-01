// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  env: {
    viaRecruiterKeys: process.env.VIA_RECRUITER_KEYS,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    nextSecret: process.env.NEXTAUTH_SECRET,
  },
  redirects: async () => {
    return [
      {
        source: '/:shopAppUrl/product',
        destination: '/:shopAppUrl/product/table',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
