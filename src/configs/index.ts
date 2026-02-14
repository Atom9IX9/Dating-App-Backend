export default () => ({
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE,
  db: {
    port: +process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
});
