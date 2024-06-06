import axios from "axios";
import * as querystring from "querystring";
import HttpClient, { RequestOptions } from "../../domain/models/utils/HttpClient";

export default class AxiosHttpClient implements HttpClient {
  public async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const res = await axios.get<T>(url, options);
    return res.data;
  }

  public async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    let stringifiedData: string = '';
    if (typeof data === 'string') {
      stringifiedData = data;
    } else if (options?.headers['content-type'] === 'application/x-www-form-urlencoded') {
      stringifiedData = querystring.stringify(data);
    } else {
      stringifiedData = JSON.stringify(data);
    }

    const res = await axios.post<T>(url, stringifiedData, {
      headers: options?.headers,
    });
    return res.data;
  }
}
