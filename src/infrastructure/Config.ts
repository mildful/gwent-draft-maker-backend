export interface HttpServerConfig {
  enabled: boolean;
  port: number;
  cors: {
    origins: string[];
  };
  version: string;
}

export type HypermediaServerConfig = Omit<HttpServerConfig, 'version'>;

export interface ServerConfig {
  http: HttpServerConfig;
  hypermedia: HypermediaServerConfig;
}

export interface FirebaseConfig {
  projectId: string;
}

export interface LoggerConfig {
  enabled: boolean;
  level: number;
  middleware: boolean;
}

export interface DatabasePostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  schema: string;

}

export interface DatabaseConfig {
  postgres: DatabasePostgresConfig;
}

export default interface Config {
  environment: string;
  version: string;
  server: ServerConfig;
  auth: {
    firebase: FirebaseConfig;
  };
  logger: LoggerConfig;
  database: DatabaseConfig;
}
