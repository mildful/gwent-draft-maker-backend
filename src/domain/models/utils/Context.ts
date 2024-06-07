import User from "../Card";

export interface ContextData {
  traceId?: string;
  userId?: string;
  routePath?: string;
  method?: string;
}

export default interface Context {
  start(): void;
  set<T extends keyof ContextData>(key: T, value: ContextData[T]): void;
  get<T extends keyof ContextData>(key: T): ContextData[T] | null;
}
