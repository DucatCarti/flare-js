import { ProcessingErrors } from "./libraries/processingErrors";
import { Component } from "./framework/components";
import { VNode } from "./framework/types";

export interface StoreOptions {
  state: () => Record<string, unknown>;
  actions?: Record<string, Function>;
}

export interface Route {
  path: string;
  component: {
    render: () => VNode;
    $route?: { params: RouteParams };
  };
  params?: RouteParams;
  notFoundPage?: false | boolean
}

export interface CurrentRoute {
  path: string;
  params: RouteParams;
}

export interface RouteParams {
  [key: string]: string;
}

export interface objectParamsScheme {
  [key: string]: string | number;
}

export interface fetchDataScheme {
  method?: string;
  mode?: string;
  cache?: string;
  credentials?: string;
  redirect?: string;
  referrerPolicy?: string;
  headers?: objectParamsScheme;
  body?: string;
}

export interface optionsDataScheme {
  baseURL?: string;
  headers?: objectParamsScheme;
  unBeforeRequest?: () => void;
  unRequest?: (request: requestDataScheme) => void;
  unBeforeSending?: (optionsFetch: fetchDataScheme) => void;
  unSending?: (response: responseDataScheme) => void;
  unBeforeResponse?: (response: responseDataScheme) => void;
  unResponse?: (response: responseDataScheme) => void;
  unError?: () => void;
}

export interface requestDataScheme {
  method?: string;
  mode?: string;
  cache?: string;
  credentials?: string;
  redirect?: string;
  referrerPolicy?: string;
  headers?: objectParamsScheme;
  params?: objectParamsScheme;
  body?: objectParamsScheme;
  path?: string;
}

export interface responseDataScheme<T = any> extends Response {
  data?: T;
  request?: requestDataScheme;
}

export interface networkErrorScheme extends ErrorConstructor {
  name: string;
  request: requestDataScheme;
  response: responseDataScheme;
  message: string;
}

export interface optionsProcessingScheme {
  backgroundColor?: string;
  backgroundOpacity?: number;
  titleColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonBackground?: string;
}

export interface errorsProcessingScheme {
  name: string;
  message: string;
  stack?: string;
}
