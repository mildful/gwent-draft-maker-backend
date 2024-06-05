export interface Headers {
  [key: string]: string;
}

export interface RequestOptions {
  headers: Headers;
}

export default interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T>;
}
