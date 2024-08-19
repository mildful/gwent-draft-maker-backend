import { LogLevel } from '../src/domain/models/utils/Logger';

module.exports = {
  server: {
    http: {
      enabled: false,
      cors: {
        origins: (process.env.SERVER_CORS_ORIGINS || 'http://localhost:5173').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
      },
      version: 'localversion',
    },
    hypermedia: {
      enabled: true,
      cors: {
        origins: (process.env.HYPERMEDIA_CORS_ORIGINS || 'http://localhost:5173').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
      },
    }
  },
  logger: {
    level: LogLevel.Verbose,
  },
  database: {
    mongodb: {
      uri: 'mongodb://root:example@mongo:27017/',
    },
  },
  providers: {
    session: {
      jwtBearer: {
        tokenPassPhrase: 'nemrodRocks',
      },
    },
  },
};
