import * as dateFns from 'date-fns';
import { Validator } from '../../domain/shared/Validator';
import Context from '../../domain/models/Context';
import Logger, { LogLevel, Color } from '../../domain/models/Logger';

export interface Writable {
  write: Function;
}

export interface ConsoleLoggerParams {
  stream?: Writable;
  context: Context;
  applicationId: string;
  level?: LogLevel;
  pretty?: boolean;
  enabled?: boolean;
}

export default class ConsoleLogger implements Logger {
  private readonly stream: Writable;
  private readonly context: Context;
  private readonly level: LogLevel;
  private readonly applicationId: string;
  private readonly pretty: boolean;
  private readonly enabled: boolean;

  constructor(params: ConsoleLoggerParams) {
    Validator.validate(params, Validator.isObject, 'Stream logger params must be an object');
    Validator.validate(
      params.applicationId, Validator.isNonEmptyString, 'Stream logger application id must be a non-empty string',
    );

    this.stream = Validator.isObject(params.stream) && Validator.isFunction(params.stream.write)
      ? params.stream : process.stderr;

    this.context = params.context;
    this.applicationId = params.applicationId.trim();
    this.level = Validator.isNumber(params.level) ? params.level : LogLevel.Info;
    this.pretty = Validator.isBoolean(params.pretty) ? params.pretty : false;
    this.enabled = Validator.isBoolean(params.enabled) ? params.enabled : true;
  }

  private getLevelText(level: LogLevel): string {
    let color: Color;
    switch (level) {
      case LogLevel.Debug: color = Color.Cyan; break;
      case LogLevel.Verbose: color = Color.Blue; break;
      case LogLevel.Warning: color = Color.Yellow; break;
      case LogLevel.Error: color = Color.Red; break;
      default: color = Color.Green; break;
    }

    return `\x1B[${color}m${LogLevel[level].toLocaleLowerCase()}\x1B[0m`;
  }

  public log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.enabled || this.level < level) {
      return;
    }

    let line: string;
    const now = new Date();
    if (this.pretty) {
      line = `${now.toUTCString()} [${this.getLevelText(level)}] ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
    } else {
      const log = {
        traceId: this.context.get('traceId'),
        app: this.applicationId,
        date: dateFns.format(now, 'dd/LLL/yyyy:HH:mm:ss.SSS xx'),
        level: LogLevel[level].toLocaleLowerCase(),
        routePath: this.context.get('routePath'),
        method: this.context.get('method'),
        playerId: this.context.get('user')?.id,
        message,
        data,
      };
      line = JSON.stringify(log);
    }

    this.stream.write(`${line}\n`);
  }

  public error(message: string, data?: unknown): void {
    this.log(LogLevel.Error, message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.Warning, message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log(LogLevel.Info, message, data);
  }

  public verbose(message: string, data?: unknown): void {
    this.log(LogLevel.Verbose, message, data);
  }

  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.Debug, message, data);
  }

  public writeRaw(data: string): void {
    if (this.enabled && Validator.isNonEmptyString(data)) {
      this.stream.write(data);
    }
  }
}
