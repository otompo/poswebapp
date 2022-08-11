module.exports = {
  reactStrictMode: true,
  env: {
    DB_URL:
      'mongodb+srv://sasco:oAPRV35UNyWLorpF@cluster0.fpvql.mongodb.net/posdb?retryWrites=true&w=majority',
    DB_LOCAL: 'mongodb://localhost:27017/posdb',
    JWT_SECRET: 'sfskftsfdssdsp3405059o53H530smdslf',
    JWT_COOKIE_EXPIRES_IN: '50',
    AWS_REGION: 'us-west-2',
    AWS_API_VERSION: '2012-10-17',
    NEXTAUTH_URL: 'https://pos.com',
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
