export default () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  jwtRememberMeExpire: process.env.JWT_REMEMBER_ME_EXPIRE,
  db: {
    port: +process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
});
