module.exports = {
  environment: process.env.ENVIRONMENT || 'development',
  version: process.env.APPLICATION_VERSION || '0.0.0',
  server: {
    http: {
      enabled: process.env.HTTP_SERVER_ENABLED !== 'false',
      port: process.env.HTTP_SERVER_PORT ? +process.env.HTTP_SERVER_PORT : 8081,
      cors: {
        origins: (process.env.HTTP_SERVER_CORS_ORIGINS || '').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
      },
    }
  },
  auth: {
    firebase: {
      projectId: 'boilerplate-playground',
    },
  },
  logger: {
    enabled: process.env.LOGGER_ENABLED !== 'false',
    level: process.env.LOGGER_LEVEL ? +process.env.LOGGER_LEVEL : 2,
    middleware: process.env.LOGGER_MIDDLEWARE !== 'false',
  },
  database: {
    postgres: {
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DATABASE || 'gwent_draft_maker',
      password: process.env.POSTGRES_PASSWORD || 'myPassword',
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      schema: process.env.POSTGRES_SCHEMA || 'public',
    },
  },
};
