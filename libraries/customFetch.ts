import {
  objectParamsScheme,
  fetchDataScheme,
  optionsDataScheme,
  requestDataScheme,
  responseDataScheme,
  networkErrorScheme
} from '../types'

export class CustomFetch {
  _globalBaseURL: string;
  _headers: objectParamsScheme;
  _unBeforeRequest?: () => void;
  _unRequest?: (request: requestDataScheme) => void;
  _unBeforeSending?: (optionsFetch: fetchDataScheme) => void;
  _unSending?: (response: responseDataScheme) => void;
  _unBeforeResponse?: (response: responseDataScheme) => void;
  _unResponse?: (response: responseDataScheme) => void;
  _unError?: () => void;

  constructor(config: optionsDataScheme = {}) {
    this._globalBaseURL = config.baseURL ?? "";
    this._headers = config.headers ?? {};
    this._unBeforeRequest = config.unBeforeRequest;
    this._unRequest = config.unRequest;
    this._unBeforeSending = config.unBeforeSending;
    this._unSending = config.unSending;
    this._unBeforeResponse = config.unBeforeResponse;
    this._unResponse = config.unResponse;
    this._unError = config.unError;
  }

  async request(url: string, config: requestDataScheme | undefined = {}): Promise<responseDataScheme | networkErrorScheme> {
    const request: requestDataScheme = this._createRequest(url, { ...config });
    return await this._fetch(request);
  }

  _createRequest(url = "", config): requestDataScheme {
    const method: string = config.method ?? "GET";
    const mode: string = config.mode ?? "cors";
    const cache: string = config.cache ?? "no-cache";
    const credentials: string = config.credentials ?? "same-origin";
    const redirect: string = config.redirect ?? "follow";
    const referrerPolicy: string = config.referrerPolicy ?? "no-referrer";
    const headers: objectParamsScheme = Object.assign(this._headers, config.headers ?? {});
    const params: objectParamsScheme = config.params ?? {};
    const body: objectParamsScheme = config.body;
    const path: string = this._globalBaseURL.concat(url);

    this._handleHooks(this._unBeforeRequest);

    const request = {
      path,
      method,
      mode,
      cache,
      credentials,
      redirect,
      referrerPolicy,
      headers,
      params,
      body,
    };

    this._handleHooks<requestDataScheme>(this._unRequest, request);

    return request;
  }

  async _createResponse(response: responseDataScheme, request: requestDataScheme = {}): Promise<responseDataScheme> {
    this._handleHooks<responseDataScheme>(this._unBeforeResponse, response);

    response.request = request;
    response.data = await response.json();

    this._handleHooks<responseDataScheme>(this._unResponse, response);

    return response;
  }

  async _fetch(request: requestDataScheme): Promise<responseDataScheme | networkErrorScheme> {
    try {
      const fieldFetchList: string[] = [
        "method",
        "mode",
        "cache",
        "credentials",
        "redirect",
        "referrerPolicy",
        "headers",
      ];

      const fullPath: string = this._getFullPath(request.path, request.params);

      const optionsFetch: fetchDataScheme = fieldFetchList.reduce(
        (options, key) => ({
          ...options,
          [key]: request[key],
        } as fetchDataScheme),
        {},
      );

      optionsFetch.body = JSON.stringify(request.body);

      this._handleHooks<fetchDataScheme>(this._unBeforeSending, optionsFetch);

      const response = await fetch(fullPath, optionsFetch as RequestInit);

      this._handleHooks<responseDataScheme>(this._unSending, response);

      if (response.status >= 200 && response.status < 299) {
        return this._createResponse(response, request);
      }

      throw new NetworkError(
        `Request failed with status code ${response.status}`,
        request,
        response,
      );
    } catch (error: any) {
      this._handleHooks(this._unError);

      if (error.name === "NetworkError") {
        throw error;
      }

      throw new NetworkError(error.message, request);
    }
  }

  _getFullPath(path: string = "", params: objectParamsScheme = {}): string {
    const paramsKeyList: string[] = Object.keys(params);

    if (paramsKeyList.length === 0) {
      return path;
    }

    const paramsStr: string = paramsKeyList
      .map((key) => {
        if (!Array.isArray(params[key])) {
          return `${key}=${params[key]}`;
        }

        return (params[key] as string[])
          .map((item, index) => `${key}[${index}]=${item}`)
          .join("&");
      })
      .join("&");

    return `${path}?${paramsStr}`;
  }

  _handleHooks<T>(handle, data?: T) {
    if (typeof handle !== "function") {
      return;
    }

    handle(data);
  }
}

class NetworkError extends Error {
  name: string;
  request?: requestDataScheme;
  response?: responseDataScheme;


  constructor(message: string = "", request: requestDataScheme, response?: responseDataScheme) {
    super(message);
    this.name = "NetworkError";
    this.request = request;
    this.response = response;
  }
}
