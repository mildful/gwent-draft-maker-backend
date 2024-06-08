import * as config from 'config';
import * as http from 'http';
import axios from 'axios';
import { BindingScopeEnum, Container } from 'inversify';
import * as firebaseAdmin from 'firebase-admin/app';

import Logger from '../domain/models/utils/Logger';
import ConsoleLogger from './utils/ConsoleLogger';
import Context from '../domain/models/utils/Context';
import ExecutionContext from './utils/ExecutionContext';
import Clock from '../domain/models/utils/Clock';
import SystemClock from './utils/SystemClock';
import HttpClient from '../domain/models/utils/HttpClient';
import AxiosHttpClient from './utils/AxiosHttpClient';

import Server from './Server';
import UserRepository from './repositories/UserRepository';
import BcryptHash from './utils/BcryptHash';
import Hash from '../domain/models/utils/Hash';
import AuthProvider from './providers/auth/AuthProvider';
import FirebaseAuthProvider from './providers/auth/FirebaseAuthProvider';

export class Application {
  private server: Server;
  public readonly container: Container;
  public readonly logger: Logger;

  private readonly context: Context;

  constructor() {
    this.loadEnvVars();

    this.container = new Container({ defaultScope: BindingScopeEnum.Singleton });
    this.context = new ExecutionContext();
    this.logger = new ConsoleLogger({
      context: this.context,
      applicationId: process.env.npm_package_name ?? 'undefined',
      level: config.get<number>('logger.level'),
      pretty: process.env.NODE_ENV === 'development',
      enabled: config.get<boolean>('logger.enabled'),
    });
    // this.context = 
  }

  public async start(): Promise<http.Server> {
    this.bindUtils();
    await this.bindRepositories();
    this.bindServices();
    this.bindProviders();
    this.initAxios();

    this.server = new Server(
      this.container,
      config.get<number>('server.port'),
      config.get<string[]>('server.cors.origins'),
      config.get<boolean>('logger.middleware'),
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

  private bindUtils(): void {
    this.container.bind<Context>('Context').toConstantValue(this.context);
    this.container.bind<Logger>('Logger').toConstantValue(this.logger);
    this.container.bind<Clock>('Clock').toConstantValue(new SystemClock());
    this.container.bind<HttpClient>('Http').toConstantValue(new AxiosHttpClient());
    this.container.bind<Hash>('Hash').toConstantValue(new BcryptHash());
  }

  private async bindRepositories(): Promise<void> {
    // TODO: config to switch
    // const mongodbLayer = new MongoDbLayer({
    //   ...config.get('database.mongodb'),
    // }, this.logger);
    // await mongodbLayer.initialize();
    // this.container.bind<MongoDbLayer>('MongoDbLayer').toConstantValue(mongodbLayer);

    // this.container.bind<UserRepository>('Repository').to(InMemoryUserRepository).whenTargetNamed('User');
  }

  private bindServices(): void {

  }

  private bindProviders(): void {
    // firebase
    // TODO: conditional if firebase is activated
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.applicationDefault(),
      projectId: config.get<string>('firebase.projectId'),
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
