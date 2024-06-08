module.exports = {
  server: {
    port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 8080,
    cors: {
      origins: (process.env.SERVER_CORS_ORIGINS || '').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
    },
    environment: process.env.ENVIRONMENT || 'local',
    version: process.env.APPLICATION_VERSION,
  },
  firebase: {
    projectId: 'boilerplate-playground',
  },
  logger: {
    enabled: process.env.LOGGER_ENABLED !== 'false',
    level: process.env.LOGGER_LEVEL ? +process.env.LOGGER_LEVEL : 2,
    middleware: process.env.LOGGER_MIDDLEWARE !== 'false',
  },
  database: {
    posgres: {
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      database: process.env.POSTGRES_DATABASE || 'gwent_draft_maker',
      password: process.env.POSTGRES_PASSWORD || 'myPassword',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      schema: process.env.POSTGRES_SCHEMA || 'public',
    },
  },
  providers: {
    session: {
      jwtBearer: {
        tokenLifeTime: process.env.JWT_TOKEN_LIFETIME ? +process.env.JWT_TOKEN_LIFETIME : 3600 * 24,
        tokenPassPhrase: process.env.JWT_TOKEN_PASSPHRASE, // openssl rand -hex 32
      },
    },
    auth: {
      twitch: {
        clientId: process.env.TWITCH_CLIENT_ID,
        secret: process.env.TWITCH_SECRET,
        redirectUri: process.env.TWITCH_REDIRECT_URI || 'http://localhost:5173/auth/twitch/redirect',
      }
    }
  },
};
