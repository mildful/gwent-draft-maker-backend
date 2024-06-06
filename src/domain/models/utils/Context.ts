import User from "../User";

export interface ContextData {
  traceId?: string;
  user?: User;
  routePath?: string;
  method?: string;
}

export default interface Context {
  start(): void;
  set<T extends keyof ContextData>(key: T, value: ContextData[T]): void;
  get<T extends keyof ContextData>(key: T): ContextData[T] | null;
}
