import type { Properties as CSSProperties } from "csstype";
import { toCamelCase, camelToKebab, isUndef } from "./utils";

export interface LogOptinos {
  backgroundColor?: string;
  fontSize?: string;
  color?: string;
  radius?: string;
  padding?: string;
  margin?: string;
  style?: CSSProperties;
  text?: string;
  type?: string;
}
export interface ThemeColor {
  primaryColor?: string;
  dangerColor?: string;
  errorColor?: string;
  infoColor?: string;
  warnColor?: string;
  successColor?: string;
}

export interface ConsoleConfig {
  interceptor?: (options: LogReturn) => LogReturn | void;
  noConsole?: boolean;
}

export type ConsoleOptions = ThemeColor & ConsoleConfig & LogOptinos;


export type LogReturn = {
  noConsole: boolean;
  logArgs: Array<string>;
  styles: Array<CSSProperties>;
  texts: Array<string>;
  args: LogOptinos | Array<LogOptinos>;
  options: Array<Pick<LogOptinos, "style" | "type" | "text">>;
};
export default class JcConsole {
  public backgroundColor: string;
  public text: string;
  public fontSize: string;
  public color: string;
  public radius: string;
  public padding: string;
  public margin: string;

  public primaryColor: string;
  public dangerColor: string;
  public errorColor: string;
  public infoColor: string;
  public warnColor: string;
  public successColor: string;

  public defaultStyle: CSSProperties;

  public interceptor: ConsoleConfig["interceptor"];
  public _noConsole: boolean;
  public options: ConsoleOptions;
  constructor(options: ConsoleOptions = {}) {
    this.options = options;
    this.backgroundColor = options.backgroundColor || "transparent";
    this.text = options.text || "text";
    this.defaultStyle = options.style || {};
    this.fontSize = options.fontSize || "12px";
    this.color = options.color || "#fff";
    this.radius = options.radius || "2px";
    this.padding = options.padding || "3px 5px";
    this.margin = options.margin || "0 5px 0 0";

    this.primaryColor = options.primaryColor || "#165DFF";
    this.dangerColor = options.dangerColor || "#DC3545";
    this.errorColor = options.errorColor || "rgb(245, 108, 108)";
    this.infoColor = options.infoColor || "rgb(144, 147, 153)";
    this.warnColor = options.warnColor || "rgb(230, 162, 60)";
    this.successColor = options.successColor || "rgb(103, 194, 58)";

    this.interceptor = options.interceptor;
    this._noConsole = false;
  }

  private _style(options: ConsoleOptions): CSSProperties {
    let style: CSSProperties = {};
    let styleObject: CSSProperties = {};
    const optionsStyle: CSSProperties = options.style;
    style.borderRadius = options.radius || this.radius;
    ["fontSize", "color", "padding", "backgroundColor", "margin"].forEach(
      (key) => {
        // @ts-ignore
        let value = options[key] || this[key];
        if (!value) return;
        // @ts-ignore
        style[key] = value;
      }
    );
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

  private _log(args: LogOptinos | Array<LogOptinos>, noConsole?: boolean) {
    if (typeof args !== "object" || args === null) return;
    const logParamsArray: Array<LogOptinos> = [];

    // init object
    let options = logParamsArray.concat(args).map((item) => {
      const text = `${isUndef(item.text) ? this.text : item.text}`;
      const style = this._style(item);
      return {
        type: item.type,
        text,
        style,
      };
    });

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
    const iscon = isUndef(noConsole) ? this.options.noConsole : noConsole;
    let logReturn: LogReturn = {
      noConsole: iscon,
      logArgs: [strTexts, ...strStyles],
      args,
      texts,
      options,
      styles,
    };

    // interceptor
    if (!this._noConsole) {
      if (this.interceptor && typeof this.interceptor === "function") {
        let res = this.interceptor(logReturn);
        if (res) {
          logReturn = res;
        }
      }
      !logReturn.noConsole && console.log(strTexts, ...strStyles);
    }

    return logReturn;
  }

  private _img(
    url: string,
    width = "100px",
    height = "100px",
    style?: CSSProperties,
    noConsole?: boolean
  ): LogReturn {
    return this._log(
      {
        text: " ",
        style: {
          backgroundColor: "tranparent",
          padding: `${height} ${width}`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${url})`,
          ...style,
        },
        type: "img",
      },
      noConsole
    );
  }

  error(text?: string, style?: CSSProperties, noConsole?: boolean): LogReturn {
    return this._log({
      text: text || "error",
      backgroundColor: this.errorColor,
      style,
      type: "error",
    },noConsole);
  }

  danger(text?: string, style?: CSSProperties, noConsole?: boolean): LogReturn {
    return this._log({
      text: text || "danger",
      backgroundColor: this.dangerColor,
      style,
      type: "danger",
    },noConsole);
  }

  info(text?: string, style?: CSSProperties, noConsole?: boolean): LogReturn {
    return this._log({
      text: text || "info",
      backgroundColor: this.infoColor,
      style,
      type: "info",
    }, noConsole);
  }

  primary(
    text?: string,
    style?: CSSProperties,
    noConsole?: boolean
  ): LogReturn {
    return this._log({
      text: text || "primary",
      backgroundColor: this.primaryColor,
      style,
      type: "primary",
    },noConsole);
  }

  log(text?: string, style?: CSSProperties, noConsole?: boolean): LogReturn {
    return this._log({
      text: text || "log",
      backgroundColor: "transparent",
      color: "#333",
      style,
      type: "log",
    },noConsole);
  }

  success(
    text?: string,
    style?: CSSProperties,
    noConsole?: boolean
  ): LogReturn {
    return this._log({
      text: text || "success",
      backgroundColor: this.successColor,
      style,
      type: "success",
    },noConsole);
  }

  warn(text?: string, style?: CSSProperties, noConsole?: boolean): LogReturn {
    return this._log({
      text: text || "warn",
      backgroundColor: this.warnColor,
      style,
      type: "warn",
    }, noConsole);
  }

  img(
    url: string,
    width: string,
    height: string,
    style?: CSSProperties,
    noConsole?: boolean
  ): LogReturn;

  img(params: {
    url: string;
    width?: string;
    height?: string;
    style?: CSSProperties;
    noConsole?: boolean;
  }): LogReturn;

  img(
    params: any,
    width?: string,
    height?: string,
    style?: CSSProperties,
    noConsole?: boolean
  ): LogReturn {
    if (typeof params === "string") {
      return this._img(params, width, height, style, noConsole);
    }
    if (typeof params === "object") {
      const { url, width, height, style } = params;
      return this._img(url, width, height, style, noConsole);
    }
  }
  row(fn: LogOptinos | Array<LogOptinos>): LogReturn;
  row(fn: () => Array<LogReturn>): LogReturn;
  row(
    fn: (() => Array<LogReturn>) | LogOptinos | Array<LogOptinos>,
    noConsole?: boolean
  ): LogReturn {
    let logparams: LogOptinos | Array<LogOptinos>;
    if (typeof fn === "function") {
      this._noConsole = true;
      let result = this._log(fn().map((item) => item.args as LogOptinos));
      this._noConsole = false;
      logparams = result.args;
    } else {
      logparams = fn;
    }
    return this._log(logparams, noConsole);
  }
}
