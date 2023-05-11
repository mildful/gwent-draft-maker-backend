import * as asyncHooks from 'async_hooks';
import Context, { ContextData } from '../../domain/models/Context';

export default class ExecutionContext implements Context {
  private readonly data: { [key: number]: { [k in keyof ContextData]?: ContextData[k] } };

  constructor() {
    // Initialize empty dictionnary
    this.data = {};

    // Load async hooks
    const hooks = asyncHooks.createHook({
      init: (asyncId: number, type: string, triggerAsyncId: number) => {
        if (this.data[triggerAsyncId]) {
          this.data[asyncId] = this.data[triggerAsyncId];
        }
      },
      destroy: /* istanbul ignore next */ (asyncId: number) => {
        delete this.data[asyncId];
      },
    });

    hooks.enable();
  }

  public start(): void {
    const asyncId = asyncHooks.executionAsyncId();
    this.data[asyncId] = {};
  }

  public set<T extends keyof ContextData>(key: T, value: ContextData[T]): void {
    const asyncId = asyncHooks.executionAsyncId();
    this.data[asyncId][key] = value;
  }

  public get<T extends keyof ContextData>(key: T): ContextData[T] | null {
    const asyncId = asyncHooks.executionAsyncId();
    return this.data[asyncId] ? this.data[asyncId][key] : null;
  }
}
