import * as cookieParser from 'cookie-parser';
import { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as express from 'express';
import * as DomainErrors from '../../../domain/shared/Errors';
import Context from '../../../domain/models/utils/Context';
import Logger, { LogLevel } from '../../../domain/models/utils/Logger';
import { ErrorCode } from '../../../domain/shared/Errors';
import { ContextMiddleware } from '../../middlewares/ContextMiddleware';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import { CorsMiddleware } from '../../middlewares/CorsMiddleware';
import { LogMiddleware } from '../../middlewares/LogMiddleware';
import path = require('path');

// TODO: automatically import based on file system
import './controllers/HxDraftController';

export default class HypermediaServer {
  private readonly logger: Logger;
  private readonly context: Context;
  private rawServer: http.Server | null;

  constructor(
    private readonly container: Container,
    private readonly port: number,
    private readonly corsOrigins: string[],
    private readonly logMiddlewareEnabled: boolean,
  ) {
    this.logger = this.container.get<Logger>('Logger');
    this.context = this.container.get<Context>('Context');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async start(): Promise<http.Server> {
    if (this.rawServer) {
      return this.rawServer;
    }

    const server = new InversifyExpressServer(this.container);

    server.setConfig((app) => {
      // Load application middlewares
      this.loadMiddlewares(app);
    });

    // Add top level error handler
    server.setErrorConfig(this.handleError.bind(this));

    const application = server.build();

    // Add 404 page handler
    this.handlePageNotFound(application);

    // Start the server
    this.rawServer = application.listen(this.port, () => {
      this.logger.info(`Hypermedia server started on port ${this.port}`);
    }) as http.Server;

    return this.rawServer;
  }

  public stop(): Promise<void> {
    if (!this.rawServer) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      (this.rawServer as http.Server).close((err) => {
        this.rawServer = null;

        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private loadMiddlewares(app: Application): void {
    // TODO: at some point
    // this.container.bind('LimiterMiddleware').to(LimiterMiddleware);
    // this.container.bind('KillSwitchMiddleware').to(KillSwitchMiddleware);
    this.container.bind('AuthMiddleware').to(AuthMiddleware);

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '/templates'));

    const corsMiddleware = new CorsMiddleware(this.corsOrigins);
    app.use(corsMiddleware.addCorsHeaders.bind(corsMiddleware));

    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../../../../public')));

    const contextMiddleware = new ContextMiddleware(this.context);
    app.use(contextMiddleware.initContext.bind(contextMiddleware));

    const logMiddleware = new LogMiddleware(this.context, {
      logger: this.logger,
      pretty: process.env.NODE_ENV === 'development',
      enabled: this.logMiddlewareEnabled,
      prefix: 'Hypermedia',
    });
    app.use(logMiddleware.logRequest.bind(logMiddleware));
  }

  private handleHttpCodeFromError(err: Error): number {
    let code = 500;
    if (err instanceof DomainErrors.ValidationError) {
      code = 400;
    } else if (err instanceof DomainErrors.ForbiddenError) {
      code = 403;
    } else if (err instanceof DomainErrors.ConflictError) {
      code = 409;
    } else if (err instanceof DomainErrors.UnauthorizedError) {
      code = 401;
    } else if (err instanceof DomainErrors.NotFoundError) {
      code = 404;
    } else if (err instanceof DomainErrors.ServerError) {
      code = 500;
    }

    return code;
  }

  private handleError(app: Application): void {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      const code = this.handleHttpCodeFromError(err);

      const isDomainError = DomainErrors.DomainError.isDomainError(err);

      this.logger.log(code >= 500 ? LogLevel.Error : LogLevel.Info, 'Unhandled exception during request', {
        message: err.message,
        code: isDomainError ? err.code : 'GenericError',
        stack: err.stack,
        data: isDomainError && err.data ? err.data : err,
        statusCode: code,
      });

      if (res.headersSent) {
        this.logger.warn('Unhandled exception after response has been sent to the client', {
          responseCode: res.statusCode,
        });
        return res;
      }

      return res.status(code).json({
        message: (code >= 500 && process.env.NODE_ENV === 'production') || (!err.message) ? 'An unexpected error occurred' : err.message,
        code: isDomainError ? err.code : 'GenericError',
        traceId: this.context.get('traceId'),
        data: isDomainError && err.data ? err.data : undefined,
      });
    });
  }

  private handlePageNotFound(app: Application): void {
    app.use((req, res) => {
      res.status(404).json({
        message: 'Page not found',
        code: ErrorCode.PAGE_NOT_FOUND,
        traceId: this.context.get('traceId'),
      });
    });
  }
}
