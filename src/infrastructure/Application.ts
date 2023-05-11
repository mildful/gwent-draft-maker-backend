import * as config from 'config';
import * as http from 'http';
import axios from 'axios';
import { BindingScopeEnum, Container } from 'inversify';

import Logger from '../domain/models/Logger';
import ConsoleLogger from './utils/ConsoleLogger';
import Context from '../domain/models/Context';
import ExecutionContext from './utils/ExecutionContext';
import Clock from '../domain/models/Clock';
import SystemClock from './utils/SystemClock';

import UserRepository from './repositories/UserRepository';
import MongoDbLayer from './repositories/mongodb/MongoDbLayer';
import MongoDbUserRepository from './repositories/mongodb/implementations/MongoDbUserRepository';
import UserService from '../application/services/UserService';
import Server from './Server';

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
      applicationId: process.env.npm_package_name,
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
    // this.bindProviders();
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
    this.container.bind<string>('Server').toConstantValue(config.get('server.environment'))
      .whenTargetNamed('Environment');
    this.container.bind<boolean>('Server').toConstantValue(config.get('server.enabled'))
      .whenTargetNamed('Enabled');
    this.container.bind<string>('Server').toConstantValue(config.get('server.version'))
      .whenTargetNamed('Version');
  }

  private async bindRepositories(): Promise<void> {
    const mongodbLayer = new MongoDbLayer({
      ...config.get('database.mongodb'),
    }, this.logger);
    await mongodbLayer.initialize();
    this.container.bind<MongoDbLayer>('MongoDbLayer').toConstantValue(mongodbLayer);

    this.container.bind<UserRepository>('Repository').to(MongoDbUserRepository).whenTargetNamed('User');
  }

  private bindServices(): void {
    this.container.bind<UserService>('Service').to(UserService).whenTargetNamed('User');
  }

  private loadEnvVars(): void {
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
