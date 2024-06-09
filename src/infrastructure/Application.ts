import axios from 'axios';
import * as config from 'config';
import * as firebaseAdmin from 'firebase-admin/app';
import * as http from 'http';
import { BindingScopeEnum, Container } from 'inversify';
import { Pool } from 'pg';

import Clock from '../domain/models/utils/Clock';
import Context from '../domain/models/utils/Context';
import HttpClient from '../domain/models/utils/HttpClient';
import Logger from '../domain/models/utils/Logger';
import AxiosHttpClient from './utils/AxiosHttpClient';
import ConsoleLogger from './utils/ConsoleLogger';
import ExecutionContext from './utils/ExecutionContext';
import SystemClock from './utils/SystemClock';

import DeckService from '../application/services/DeckService';
import DraftService from '../application/services/DraftService';
import Hash from '../domain/models/utils/Hash';
import Config, { DatabasePostgresConfig } from './Config';
import Server from './Server';
import AuthProvider from './providers/auth/AuthProvider';
import FirebaseAuthProvider from './providers/auth/FirebaseAuthProvider';
import DeckRepository from './repositories/DeckRepository';
import DraftRepository from './repositories/DraftRepository';
import PostgresLayer from './repositories/postgres/PostgresLayer';
import PostgresDeckRepository from './repositories/postgres/deck/PostgresDeckRepository';
import PostgresDraftRepository from './repositories/postgres/draft/PostgresDraftRepository';
import BcryptHash from './utils/BcryptHash';

export class Application {
  public readonly container: Container;
  public readonly logger: Logger;

  private server: Server;
  private config: Config;
  private readonly context: Context;

  constructor() {
    this.loadEnvVars();

    this.config = this.getConfig();
    this.container = new Container({ defaultScope: BindingScopeEnum.Singleton });
    this.context = new ExecutionContext();
    this.logger = new ConsoleLogger({
      context: this.context,
      applicationId: process.env.npm_package_name ?? 'undefined',
      level: this.config.logger.level,
      pretty: this.config.server.environment === 'development',
      enabled: this.config.logger.enabled,
    });
  }

  public async start(): Promise<http.Server> {
    this.bindConfig();
    this.bindUtils();
    await this.bindRepositories();
    this.bindServices();
    this.bindProviders();
    this.initAxios();

    this.server = new Server(
      this.container,
      this.config.server.port,
      this.config.server.cors.origins,
      this.config.logger.middleware,
    );

    return this.server.start();
  }

  public async stop(): Promise<void> {
    if (this.server) {
      try {
        await this.server.stop();
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  private getConfig(): Config {
    return {
      server: {
        port: config.get<number>('server.port'),
        cors: {
          origins: config.get<string[]>('server.cors.origins'),
        },
        environment: config.get<string>('server.environment'),
        version: config.get<string>('server.version'),
      },
      auth: {
        firebase: {
          projectId: config.get<string>('auth.firebase.projectId'),
        },
      },
      logger: {
        enabled: config.get<boolean>('logger.enabled'),
        level: config.get<number>('logger.level'),
        middleware: config.get<boolean>('logger.middleware'),
      },
      database: {
        postgres: {
          host: config.get<string>('database.postgres.host'),
          port: config.get<number>('database.postgres.port'),
          user: config.get<string>('database.postgres.user'),
          password: config.get<string>('database.postgres.password'),
          database: config.get<string>('database.postgres.database'),
          schema: config.get<string>('database.postgres.schema'),
        },
      },
    }
  }

  private bindConfig(): void {
    this.container.bind<Config>('Config').toConstantValue(this.config);
    this.container.bind<DatabasePostgresConfig>('Config').toConstantValue(this.config.database.postgres).whenTargetNamed('Postgres');
  }

  private bindUtils(): void {
    this.container.bind<Context>('Context').toConstantValue(this.context);
    this.container.bind<Logger>('Logger').toConstantValue(this.logger);
    this.container.bind<Clock>('Clock').toConstantValue(new SystemClock());
    this.container.bind<HttpClient>('Http').toConstantValue(new AxiosHttpClient());
    this.container.bind<Hash>('Hash').toConstantValue(new BcryptHash());
  }

  private async bindRepositories(): Promise<void> {
    const postgresPool = new Pool({
      user: this.config.database.postgres.user,
      password: this.config.database.postgres.password,
      host: this.config.database.postgres.host,
      port: this.config.database.postgres.port,
      database: this.config.database.postgres.database,
    });

    const postgresLayer = new PostgresLayer(this.logger, postgresPool, this.config.database.postgres);
    await postgresLayer.initialize();

    this.container.bind<PostgresLayer>('PostgresLayer').toConstantValue(postgresLayer);
    this.container.bind<DraftRepository>('Repository').to(PostgresDraftRepository).whenTargetNamed('Draft');
    this.container.bind<DeckRepository>('Repository').to(PostgresDeckRepository).whenTargetNamed('Deck');
  }

  private bindServices(): void {
    this.container.bind<DraftService>('Service').to(DraftService).whenTargetNamed('Draft');
    this.container.bind<DeckService>('Service').to(DeckService).whenTargetNamed('Deck');
  }

  private bindProviders(): void {
    // firebase
    // TODO: conditional if firebase is activated
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.applicationDefault(),
      projectId: this.config.auth.firebase.projectId,
    });
    this.container.bind<AuthProvider>('Provider').to(FirebaseAuthProvider).whenTargetNamed('Auth');
  }

  private loadEnvVars(): void {
    // TODO:
    // if (!process.env.npm_package_name || !process.env.npm_package_version) {
    //   // eslint-disable-next-line
    //   const p = require(path.join(__dirname, '..', '..', 'package.json'));
    //   process.env.npm_package_name = p.name.trim();
    //   process.env.npm_package_version = p.version;
    // }
  }

  private initAxios(): void {
    axios.interceptors.request.use((axiosConfig: any) => {
      this.logger.info(
        '[Axios] Sending request...',
        {
          url: axiosConfig.url,
          params: JSON.stringify(axiosConfig.params),
          body: JSON.stringify(axiosConfig.data),
          headers: JSON.stringify(axiosConfig.headers),
        },
      );
      return axiosConfig;
    }, (error: any) => {
      if (axios.isAxiosError(error)) {
        this.logger.info(
          '[Axios] Unable to send HTTP request',
          { code: error.code, message: error.message, data: JSON.stringify(error.response?.data) },
        );
      }
      return Promise.reject(error);
    });

    axios.interceptors.response.use((axiosResponse: any) => {
      this.logger.info(
        '[Axios] Response',
        { status: axiosResponse.status, data: JSON.stringify(axiosResponse.data) },
      );
      return axiosResponse;
    }, (error: any) => {
      if (axios.isAxiosError(error)) {
        this.logger.info(
          '[Axios] Response received. HTTP request failed',
          { code: error.code, message: error.message, data: JSON.stringify(error.response?.data) },
        );
      }
      return Promise.reject(error);
    });
  }
}
