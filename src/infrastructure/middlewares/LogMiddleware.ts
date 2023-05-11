import * as dateFns from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import * as onFinished from 'on-finished';
import * as onHeaders from 'on-headers';
import { Validator } from '../../domain/shared/Validator';
import Context from '../../domain/models/Context';
import Logger, { Color } from '../../domain/models/Logger';

interface LogMiddlewareParams {
  logger: Logger;
  pretty?: boolean;
  enabled?: boolean;
}

interface RequestLog {
  traceId: string;
  date: string;
  ip?: string;
  method: string;
  route: string;
  resCode: number;
  resSize: number;
  resTime: number;
  referer: string;
  userAgent: string;
}

export class LogMiddleware {
  private readonly logger: Logger;
  private readonly pretty: boolean;
  private readonly enabled: boolean;

  constructor(private readonly context: Context, params: LogMiddlewareParams) {
    Validator.validate(params, Validator.isObject, 'Log middleware params must be an object');

    this.logger = params.logger;
    this.pretty = Validator.isBoolean(params.pretty) ? params.pretty : false;
    this.enabled = Validator.isBoolean(params.enabled) ? params.enabled : true;
  }

  public logRequest(req: Request, res: Response, next: NextFunction): void {
    if (!this.enabled) {
      return next();
    }

    const start = process.hrtime();
    let duration: number;
    const traceId = this.context.get('traceId') as string;

    onHeaders(res, () => {
      const latency = process.hrtime(start);
      duration = Math.ceil((latency[0] * 1e9 + latency[1]) / 1e6);
    });

    onFinished(res, () => {
      this.writeLog(req, res, duration, traceId);
    });

    return next();
  }

  private writeLog(req: Request, res: Response, durationInMs: number, traceId: string): void {
    let line: string;
    const code = res.statusCode;
    const contentLength = res.getHeader('content-length') as string;
    const now = new Date();
    if (this.pretty) {
      // eslint-disable-next-line no-nested-ternary
      const color = code >= 500 ? Color.Red : code >= 400 ? Color.Yellow : code >= 300 ? Color.Cyan : Color.Green;

      const resTime = durationInMs ? `${durationInMs} ms` : '-';
      const size = contentLength || '-';
      line = `${now.toUTCString()} ${req.method} ${req.url} \x1B[${color}m${code}\x1B[0m ${resTime} - ${size}\n`;
    } else {
      const log: RequestLog = {
        traceId,
        date: dateFns.format(now, 'dd/LLL/yyyy:HH:mm:ss.SSS xx'),
        ip: req.header('x-forwarded-for') || req.socket.remoteAddress,
        method: req.method,
        route: req.url,
        resCode: code,
        resSize: +contentLength,
        resTime: durationInMs,
        referer: req.header('referer') as string,
        userAgent: req.header('user-agent') as string,
      };

      line = JSON.stringify(log);
    }

    this.logger.writeRaw(line);
  }
}
