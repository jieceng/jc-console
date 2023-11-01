import type { Properties as CSSProperties } from "csstype";
import { toCamelCase, camelToKebab } from "./utils";

export interface StyleOptions {
  backgroundColor?: string;
  fontSize?: string;
  color?: string;
  radius?: string;
  padding?: string;
  margin?: string;
  style?: CSSProperties;
}
export interface TextOptions {
  text?: string;
}
export interface ThemeColor {
  errorColor?: string;
  infoColor?: string;
  warnColor?: string;
  successColor?: string;
}

export type interceptorOptions = Array<{text: string; style: CSSProperties, type: string}>;

export interface BrowserConsoleConfig {
  interceptor?: (options:interceptorOptions) => interceptorOptions | void;
  type?: string;
}


export type BrowserConsoleOptions = 
  StyleOptions &
  TextOptions &
  ThemeColor &
  BrowserConsoleConfig

export default class BrowserConsole {
  public backgroundColor?: string;

  public text?: string;

  public fontSize?: string;

  public color: string;

  public radius?: string;

  public padding?: string;
  public margin?: string;

  public errorColor?: string;

  public infoColor?: string;

  public warnColor?: string;

  public successColor?: string;

  public defaultStyle: CSSProperties;

  public interceptor?: (options:interceptorOptions) => interceptorOptions | void;

  public options?: BrowserConsoleOptions;

  constructor(options: BrowserConsoleOptions = {}) {
    this.options = options;
    this.backgroundColor = options.backgroundColor || "rgba(0,0,0)";
    this.text = options.text || "text";
    this.defaultStyle = options.style || {};
    this.fontSize = options.fontSize || "12px";
    this.color = options.color || "#fff";
    this.radius = options.radius || "2px";
    this.padding = options.padding || "3px 5px";
    this.margin = options.margin || "0 5px 0 0";
    this.errorColor = options.errorColor || "rgb(245, 108, 108)";
    this.infoColor = options.infoColor || "rgb(144, 147, 153)";
    this.warnColor = options.warnColor || "rgb(230, 162, 60)";
    this.successColor = options.successColor || "rgb(103, 194, 58)";
    this.interceptor = options.interceptor;
  }

  private _style(options: BrowserConsoleOptions): CSSProperties {
    let style: CSSProperties = {};
    let styleObject: CSSProperties = {};
    const optionsStyle: CSSProperties = options.style;
    style.borderRadius = options.radius || this.radius;
    ["fontSize", "color", "padding", "backgroundColor", "margin"].forEach((key) => {
      // @ts-ignore
      let value = options[key] || this[key];
      if (!value) return;
      // @ts-ignore
      style[key] = value;
    });
    style = {
      ...style,
      ...this.defaultStyle,
      ...optionsStyle,
    };
    for (let key in style) {
      // @ts-ignore
      styleObject[toCamelCase(key)] = style[key];
    }
    return styleObject;
  }

  private _log(args: BrowserConsoleOptions | Array<BrowserConsoleOptions>) {
    if (typeof args !== "object" || args === null) return;
    const logParamsArray: Array<BrowserConsoleOptions> = [];

    // init object
    let options = logParamsArray.concat(args)
    .map((item) => {
      const text = `${item.text === undefined ? this.text : item.text}`;
      const style = this._style(item);
      return {
        type: item.type,
        text,
        style,
      };
    });


    // interceptor
    if(this.interceptor && typeof this.interceptor === 'function'){
      const ops =  this.interceptor(options)
      if(ops){
        options = ops
      }
    }

    // nodata
    if(!options?.length) return;

    // some object
    const texts = options.map((item) => `%c${item.text}`);
    const styles: Array<CSSProperties> = options.map((item) => {
      const style = Object.keys(item.style).reduce((last, next) => {
        // @ts-ignore
        last[camelToKebab(next)] = item.style[next];
        return last;
      }, {});
      return style;
    });

    // last object
    const strTexts = texts.join("");
    const strStyles = styles.map((style) => {
      return (
        Object.keys(style)
          // @ts-ignore
          .map((key) => `${key}:${style[key]};`)
          .join("")
      );
    });
    // console
    console.log(strTexts,...strStyles);
  }

  private _img(
    url: string,
    width = "100px",
    height = "100px",
    style?: CSSProperties
  ) {
    this._log({
      text: " ",
      style: {
        backgroundColor: 'tranparent',
        padding: `${height} ${width}`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${url})`,
        ...style,
      },
      type: 'img'
    });
  }

  error(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "error",
      backgroundColor: this.errorColor,
      style,
      type: "error"
    });
  }

  danger(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "danger",
      backgroundColor: this.errorColor,
      style,
      type: "danger"
    });
  }

  info(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "info",
      backgroundColor: this.infoColor,
      style,
      type: 'info'
    });
  }

  log(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "log",
      backgroundColor: this.infoColor,
      style,
      type: 'log'
    });
  }

  success(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "success",
      backgroundColor: this.successColor,
      style,
      type: 'success'
    });
  }

  warn(text?: string, style?:CSSProperties) {
    this._log({
      text: text || "warn",
      backgroundColor: this.warnColor,
      style,
      type: 'warn'
    });
  }

  img(url: string, width: string, height: string, style?: CSSProperties): void;

  img(params: {
    url: string;
    width?: string;
    height?: string;
    style?: CSSProperties;
  }): void;

  img(params: any, width?: string, height?: string, style?: CSSProperties) {
    if (typeof params === "string") {
      this._img(params, width, height, style);
    }
    if (typeof params === "object") {
      const { url, width, height, style } = params;
      this._img(url, width, height, style);
    }
  }
}
