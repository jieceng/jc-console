export interface StyleOptions {
  bg?: string;
  fontSize?: string;
  color?: string;
  radius?: string;
  padding?: string;
  style?: string;
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

export type BrowserConsoleOptions = StyleOptions &
  TextOptions &
  ThemeColor & {
    interceptor?: (arg: string, ...resetArgs: string[]) => any;
  };
export default class BrowserConsole {
  public bg?: string;

  public text?: string;

  public fontSize?: string;

  public color: string;

  public radius?: string;

  public padding?: string;

  public errorColor?: string;

  public infoColor?: string;

  public warnColor?: string;

  public successColor?: string;

  public interceptor?: (arg: string, ...resetArgs: string[]) => any;

  public options?: BrowserConsoleOptions;

  constructor(options: BrowserConsoleOptions = {}) {
    this.options = options;
    this.bg = options.bg || 'rgba(0,0,0)';
    this.text = options.text || 'text';
    this.fontSize = options.fontSize || '12px';
    this.color = options.color || '#fff';
    this.radius = options.radius || '2px';
    this.padding = options.padding || '3px 5px';
    this.errorColor = options.errorColor || 'rgb(245, 108, 108)';
    this.infoColor = options.infoColor || 'rgb(144, 147, 153)';
    this.warnColor = options.warnColor || 'rgb(230, 162, 60)';
    this.successColor = options.successColor || 'rgb(103, 194, 58)';
    this.interceptor = options.interceptor;
  }

  private _log(args: (StyleOptions & TextOptions)[] | (StyleOptions & TextOptions)) {
    if (typeof args !== 'object' || args === null) return;
    args = ([] as any).concat(args) as (StyleOptions & TextOptions)[];
    if (args.length === 0) return;
    let texts = '';
    let radius;
    const styles = args.map((item) => {
      texts += `%c${item.text || this.text}`;
      radius = item.radius;
      return this._style(item);
    });
    radius = radius || this.radius;
    styles[0] += `border-top-left-radius:${radius};border-bottom-left-radius:${radius};`;
    styles[args.length - 1] += `border-top-right-radius:${radius};border-bottom-right-radius:${radius};`;

    if (this.interceptor) {
      const interceptorResult = this.interceptor(texts, ...styles);
      if (interceptorResult) {
        console?.log(...interceptorResult);
      }else{
        console?.log(texts, ...styles);
      }
    } else {
      console?.log(texts, ...styles);
    }
  }

  private _img(url: string, width?: string, height?: string) {
    this._log({
      style: `font-size:0;
        color: transparent;
        padding: ${height || '100px'} ${width || '100px'};
        background-size: contain;
        background-color: transparent;
        background-repeat: no-repeat;
        background-image: url(${url});`,
    });
  }

  private _style(styleOptions: StyleOptions) {
    const {
      bg = this.bg,
      color = this.color,
      padding = this.padding,
      fontSize = this.fontSize,
      style = '',
    } = styleOptions;
    return `background: ${bg};
    color: ${color};
    font-size: ${fontSize};
    padding: ${padding};${style}`;
  }

  error(text?: string) {
    this._log({
      text: text || 'error',
      bg: this.errorColor,
    });
  }

  danger(text?: string) {
    this.error(text);
  }

  info(text?: string) {
    this._log({
      text: text || 'info',
      bg: this.infoColor,
    });
  }

  log(text?: string) {
    this.info(text);
  }

  success(text?: string) {
    this._log({
      text: text || 'success',
      bg: this.successColor,
    });
  }

  warn(text?: string) {
    this._log({
      text: text || 'warn',
      bg: this.warnColor,
    });
  }

  img(url: string, width: string, height: string): void;

  img(params: { url: string; width?: string; height?: string }): void;

  img(params: any, width?: string, height?: string) {
    if (typeof params === 'string') {
      this._img(params, width, height);
    }
    if (typeof params === 'object') {
      const { url, width, height } = params;
      this._img(url, width, height);
    }
  }
}
