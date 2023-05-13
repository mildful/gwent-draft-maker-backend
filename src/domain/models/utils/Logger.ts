export enum LogLevel {
  Error = 0,
  Warning = 1,
  Info = 2,
  Debug = 3,
  Verbose = 4,
}

export enum Color {
  Red = 31,
  Green = 32,
  Yellow = 33,
  Blue = 34,
  Cyan = 36,
  None = 0
}

export default interface Logger {
  log(level: LogLevel, message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  verbose(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
  writeRaw(data: string): void;
}
