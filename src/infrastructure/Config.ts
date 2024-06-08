export interface ServerConfig {
  port: number;
  cors: {
    origins: string[];
  };
  environment: string;
  version: string;
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
  server: ServerConfig;
  auth: {
    firebase: FirebaseConfig;
  };
  logger: LoggerConfig;
  database: DatabaseConfig;
}
