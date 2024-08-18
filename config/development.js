import { LogLevel } from '../src/domain/models/utils/Logger';

module.exports = {
  server: {
    http: {
      cors: {
        origins: (process.env.SERVER_CORS_ORIGINS || 'http://localhost:5173').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
      },
      version: 'localversion',
    },
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
