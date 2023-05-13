module.exports = {
  server: {
    enabled: process.env.SERVER_ENABLED !== 'false',
    port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 8080,
    cors: {
      origins: (process.env.SERVER_CORS_ORIGINS || '').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
    },
    environment: process.env.ENVIRONMENT || 'local',
    version: process.env.APPLICATION_VERSION,
  },
  logger: {
    enabled: process.env.LOGGER_ENABLED !== 'false',
    level: process.env.LOGGER_LEVEL ? +process.env.LOGGER_LEVEL : 2,
    middleware: process.env.LOGGER_MIDDLEWARE !== 'false',
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://root:example@mongo:27017/',
      databaseName: process.env.MONGODB_DATABASE_NAME || 'wall-of-pixels',
    },
  },
  providers: {
    session: {
      jwtBearer: {
        tokenLifeTime: process.env.JWT_TOKEN_LIFETIME ? +process.env.JWT_TOKEN_LIFETIME : 3600 * 24,
        tokenPassPhrase: process.env.JWT_TOKEN_PASSPHRASE,
      },
    },
    auth: {
      twitch: {
        clientId: process.env.TWITCH_CLIENT_ID,
        secret: process.env.TWITCH_CLIENT_SECRET,
      }
    }
  },
};
