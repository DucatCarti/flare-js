import { h, mount, unMount } from "../framework/vDOM";
import { VNode } from "../framework/types";
import { optionsProcessingScheme, errorsProcessingScheme } from '../types';

export class ProcessingErrors {
  _backgroundColor: string;
  _backgroundOpacity: number;
  _titleColor: string;
  _textColor: string;
  _buttonColor: string;
  _buttonBackground: string;
  _vNode: VNode | undefined;

  constructor(config: optionsProcessingScheme = {}) {
    this._backgroundColor = config.backgroundColor ?? "#000000";
    this._backgroundOpacity = config.backgroundOpacity ?? 0.9;
    this._titleColor = config.titleColor ?? "#f50505";
    this._textColor = config.textColor ?? "#f7f7f7";
    this._buttonColor = config.buttonColor ?? "#afafaf";
    this._buttonBackground = config.buttonBackground ?? "#3b3b3b";
  }

  init() {
    const context = this;

    window.onerror = function (message, source, lineno, colno, error) {
      context.open({
        name: message as string,
        message: source as string,
        stack: error?.stack,
      });
    };
  }

  open({ name="", message="", stack = "" }: errorsProcessingScheme) {
    this._vNode = this._createElement(name, message, stack);
    this._mount();
  }

  close() {
    if (this._vNode === undefined) {
      return;
    }

    unMount(this._vNode, () => {});
  }

  _createElement(name?: string, message?: string, stack?: string) {
    return h(
      "div",
      {
        style: `position: fixed; top: 0; left: 0; right: 0; z-index: 999999; height: 100%; padding: 50px;`,
      },
      h(
        "div",
        {
          style: `margin-bottom: 10px; font-size: 26px; color: ${this._titleColor};`,
        },
        `${name}`,
      ),
      h(
        "div",
        { style: `font-size: 14px; color: ${this._textColor};` },
        `${message}`,
      ),
      h("hr", { style: `margin: 15px 0; color: ${this._textColor};` }, ""),
      h(
        "div",
        { style: `font-size: 16px; color: ${this._textColor};` },
        `${stack}`,
      ),
      h(
        "button",
        {
          onclick: () => this.close(),
          style: `
          position: absolute; top: 10px; right: 10px; padding: 5px 10px; border-radius: 5px; 
          background-color: ${this._buttonBackground}; color: ${this._buttonColor}; cursor: pointer
        `,
        },
        "Закрыть",
      ),
      h(
        "div",
        {
          style: `
          position: absolute; top: 0; left: 0; z-index: -1; width: 100%; height: 100%;
          background-color: ${this._backgroundColor}; opacity:${this._backgroundOpacity};
        `,
        },
        "",
      ),
    );
  }

  _mount() {
    if (this._vNode === undefined) {
      return;
    }

    mount(this._vNode, document.body);
  }
}
