import User from "../User";
import { Id } from "./Id";

export interface ContextData {
  traceId?: string;
  userId?: Id;
  user?: User;
  sessionToken?: string;
  routePath?: string;
  method?: string;
}

export default interface Context {
  start(): void;
  set<T extends keyof ContextData>(key: T, value: ContextData[T]): void;
  get<T extends keyof ContextData>(key: T): ContextData[T] | null;
}
