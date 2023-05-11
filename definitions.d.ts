/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'on-headers' {
  function onHeaders(res: any, listener: Function): void;
  namespace onHeaders {}
  export = onHeaders;
}

declare module 'on-finished' {
  function onFinished(res: any, listener: Function): void;
  namespace onFinished {}
  export = onFinished;
}
