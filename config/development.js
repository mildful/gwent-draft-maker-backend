import { LogLevel } from '../src/domain/models/Logger';

module.exports = {
  server: {
    enabled: true,
    port: 3000,
    cors: {
      origins: (process.env.SERVER_CORS_ORIGINS || 'http://localhost:5173').split(',').map((v) => { return v.trim(); }).filter((v, i, s) => { return v !== '' && s.indexOf(v) === i; }),
    },
    version: 'localversion',
  },
  logger: {
    level: LogLevel.Verbose,
  },
  database: {
    mongodb: {
      uri: 'mongodb://root:example@mongo:27017/',
    },
  },
};
