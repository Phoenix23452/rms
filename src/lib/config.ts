const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndPoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    databaseUrl: process.env.DATABASE_URL!,
    imageKit: {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    },
  },
};

export default config;
