export class CustomFetch {
    _globalBaseURL;
    _headers;
    _unBeforeRequest;
    _unRequest;
    _unBeforeSending;
    _unSending;
    _unBeforeResponse;
    _unResponse;
    _unError;
    constructor(config = {}) {
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
    async request(url, config = {}) {
        const request = this._createRequest(url, { ...config });
        return await this._fetch(request);
    }
    _createRequest(url = "", config) {
        const method = config.method ?? "GET";
        const mode = config.mode ?? "cors";
        const cache = config.cache ?? "no-cache";
        const credentials = config.credentials ?? "same-origin";
        const redirect = config.redirect ?? "follow";
        const referrerPolicy = config.referrerPolicy ?? "no-referrer";
        const headers = Object.assign(this._headers, config.headers ?? {});
        const params = config.params ?? {};
        const body = config.body;
        const path = this._globalBaseURL.concat(url);
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
        this._handleHooks(this._unRequest, request);
        return request;
    }
    async _createResponse(response, request = {}) {
        this._handleHooks(this._unBeforeResponse, response);
        response.request = request;
        response.data = await response.json();
        this._handleHooks(this._unResponse, response);
        return response;
    }
    async _fetch(request) {
        try {
            const fieldFetchList = [
                "method",
                "mode",
                "cache",
                "credentials",
                "redirect",
                "referrerPolicy",
                "headers",
            ];
            const fullPath = this._getFullPath(request.path, request.params);
            const optionsFetch = fieldFetchList.reduce((options, key) => ({
                ...options,
                [key]: request[key],
            }), {});
            optionsFetch.body = JSON.stringify(request.body);
            this._handleHooks(this._unBeforeSending, optionsFetch);
            const response = await fetch(fullPath, optionsFetch);
            this._handleHooks(this._unSending, response);
            if (response.status >= 200 && response.status < 299) {
                return this._createResponse(response, request);
            }
            throw new NetworkError(`Request failed with status code ${response.status}`, request, response);
        }
        catch (error) {
            this._handleHooks(this._unError);
            if (error.name === "NetworkError") {
                throw error;
            }
            throw new NetworkError(error.message, request);
        }
    }
    _getFullPath(path = "", params = {}) {
        const paramsKeyList = Object.keys(params);
        if (paramsKeyList.length === 0) {
            return path;
        }
        const paramsStr = paramsKeyList
            .map((key) => {
            if (!Array.isArray(params[key])) {
                return `${key}=${params[key]}`;
            }
            return params[key]
                .map((item, index) => `${key}[${index}]=${item}`)
                .join("&");
        })
            .join("&");
        return `${path}?${paramsStr}`;
    }
    _handleHooks(handle, data) {
        if (typeof handle !== "function") {
            return;
        }
        handle(data);
    }
}
class NetworkError extends Error {
    name;
    request;
    response;
    constructor(message = "", request, response) {
        super(message);
        this.name = "NetworkError";
        this.request = request;
        this.response = response;
    }
}
