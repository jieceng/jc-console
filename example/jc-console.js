
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function toCamelCase(str) {
    return str.replace(/[_-]\w/g, match => match.charAt(1).toUpperCase());
}
function camelToKebab(camelCaseString) {
    return camelCaseString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function isUndef(value) {
    return value === undefined;
}

class JcConsole {
    backgroundColor;
    text;
    fontSize;
    color;
    radius;
    padding;
    margin;
    primaryColor;
    dangerColor;
    errorColor;
    infoColor;
    warnColor;
    successColor;
    defaultStyle;
    interceptor;
    _noConsole;
    options;
    constructor(options = {}) {
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
    _style(options) {
        let style = {};
        let styleObject = {};
        const optionsStyle = options.style;
        style.borderRadius = options.radius || this.radius;
        ["fontSize", "color", "padding", "backgroundColor", "margin"].forEach((key) => {
            // @ts-ignore
            let value = options[key] || this[key];
            if (!value)
                return;
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
    _log(args, noConsole) {
        if (typeof args !== "object" || args === null)
            return;
        const logParamsArray = [];
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
        const styles = options.map((item) => {
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
            return (Object.keys(style)
                // @ts-ignore
                .map((key) => `${key}:${style[key]};`)
                .join(""));
        });
        // console
        const iscon = isUndef(noConsole) ? this.options.noConsole : noConsole;
        let logReturn = {
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
    _img(url, width = "100px", height = "100px", style, noConsole) {
        return this._log({
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
        }, noConsole);
    }
    error(text, style, noConsole) {
        return this._log({
            text: text || "error",
            backgroundColor: this.errorColor,
            style,
            type: "error",
        }, noConsole);
    }
    danger(text, style, noConsole) {
        return this._log({
            text: text || "danger",
            backgroundColor: this.dangerColor,
            style,
            type: "danger",
        }, noConsole);
    }
    info(text, style, noConsole) {
        return this._log({
            text: text || "info",
            backgroundColor: this.infoColor,
            style,
            type: "info",
        }, noConsole);
    }
    primary(text, style, noConsole) {
        return this._log({
            text: text || "primary",
            backgroundColor: this.primaryColor,
            style,
            type: "primary",
        }, noConsole);
    }
    log(text, style, noConsole) {
        return this._log({
            text: text || "log",
            backgroundColor: "transparent",
            color: "#333",
            style,
            type: "log",
        }, noConsole);
    }
    success(text, style, noConsole) {
        return this._log({
            text: text || "success",
            backgroundColor: this.successColor,
            style,
            type: "success",
        }, noConsole);
    }
    warn(text, style, noConsole) {
        return this._log({
            text: text || "warn",
            backgroundColor: this.warnColor,
            style,
            type: "warn",
        }, noConsole);
    }
    img(params, width, height, style, noConsole) {
        if (typeof params === "string") {
            return this._img(params, width, height, style, noConsole);
        }
        if (typeof params === "object") {
            const { url, width, height, style } = params;
            return this._img(url, width, height, style, noConsole);
        }
    }
    row(fn, noConsole) {
        let logparams;
        if (typeof fn === "function") {
            this._noConsole = true;
            let result = this._log(fn().map((item) => item.args));
            this._noConsole = false;
            logparams = result.args;
        }
        else {
            logparams = fn;
        }
        return this._log(logparams, noConsole);
    }
}

export { JcConsole as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamMtY29uc29sZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZShzdHI6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXy1dXFx3L2csIG1hdGNoID0+IG1hdGNoLmNoYXJBdCgxKS50b1VwcGVyQ2FzZSgpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsVG9LZWJhYihjYW1lbENhc2VTdHJpbmc6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGNhbWVsQ2FzZVN0cmluZy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZih2YWx1ZTogYW55KXtcclxuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkXHJcbn0iLCJpbXBvcnQgdHlwZSB7IFByb3BlcnRpZXMgYXMgQ1NTUHJvcGVydGllcyB9IGZyb20gXCJjc3N0eXBlXCI7XHJcbmltcG9ydCB7IHRvQ2FtZWxDYXNlLCBjYW1lbFRvS2ViYWIsIGlzVW5kZWYgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb2dPcHRpbm9zIHtcclxuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgZm9udFNpemU/OiBzdHJpbmc7XHJcbiAgY29sb3I/OiBzdHJpbmc7XHJcbiAgcmFkaXVzPzogc3RyaW5nO1xyXG4gIHBhZGRpbmc/OiBzdHJpbmc7XHJcbiAgbWFyZ2luPzogc3RyaW5nO1xyXG4gIHN0eWxlPzogQ1NTUHJvcGVydGllcztcclxuICB0ZXh0Pzogc3RyaW5nO1xyXG4gIHR5cGU/OiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBUaGVtZUNvbG9yIHtcclxuICBwcmltYXJ5Q29sb3I/OiBzdHJpbmc7XHJcbiAgZGFuZ2VyQ29sb3I/OiBzdHJpbmc7XHJcbiAgZXJyb3JDb2xvcj86IHN0cmluZztcclxuICBpbmZvQ29sb3I/OiBzdHJpbmc7XHJcbiAgd2FybkNvbG9yPzogc3RyaW5nO1xyXG4gIHN1Y2Nlc3NDb2xvcj86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb25zb2xlQ29uZmlnIHtcclxuICBpbnRlcmNlcHRvcj86IChvcHRpb25zOiBMb2dSZXR1cm4pID0+IExvZ1JldHVybiB8IHZvaWQ7XHJcbiAgbm9Db25zb2xlPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQ29uc29sZU9wdGlvbnMgPSBUaGVtZUNvbG9yICYgQ29uc29sZUNvbmZpZyAmIExvZ09wdGlub3M7XHJcblxyXG5cclxuZXhwb3J0IHR5cGUgTG9nUmV0dXJuID0ge1xyXG4gIG5vQ29uc29sZTogYm9vbGVhbjtcclxuICBsb2dBcmdzOiBBcnJheTxzdHJpbmc+O1xyXG4gIHN0eWxlczogQXJyYXk8Q1NTUHJvcGVydGllcz47XHJcbiAgdGV4dHM6IEFycmF5PHN0cmluZz47XHJcbiAgYXJnczogTG9nT3B0aW5vcyB8IEFycmF5PExvZ09wdGlub3M+O1xyXG4gIG9wdGlvbnM6IEFycmF5PFBpY2s8TG9nT3B0aW5vcywgXCJzdHlsZVwiIHwgXCJ0eXBlXCIgfCBcInRleHRcIj4+O1xyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKY0NvbnNvbGUge1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gIHB1YmxpYyBmb250U2l6ZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb2xvcjogc3RyaW5nO1xyXG4gIHB1YmxpYyByYWRpdXM6IHN0cmluZztcclxuICBwdWJsaWMgcGFkZGluZzogc3RyaW5nO1xyXG4gIHB1YmxpYyBtYXJnaW46IHN0cmluZztcclxuXHJcbiAgcHVibGljIHByaW1hcnlDb2xvcjogc3RyaW5nO1xyXG4gIHB1YmxpYyBkYW5nZXJDb2xvcjogc3RyaW5nO1xyXG4gIHB1YmxpYyBlcnJvckNvbG9yOiBzdHJpbmc7XHJcbiAgcHVibGljIGluZm9Db2xvcjogc3RyaW5nO1xyXG4gIHB1YmxpYyB3YXJuQ29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgc3VjY2Vzc0NvbG9yOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyBkZWZhdWx0U3R5bGU6IENTU1Byb3BlcnRpZXM7XHJcblxyXG4gIHB1YmxpYyBpbnRlcmNlcHRvcjogQ29uc29sZUNvbmZpZ1tcImludGVyY2VwdG9yXCJdO1xyXG4gIHB1YmxpYyBfbm9Db25zb2xlOiBib29sZWFuO1xyXG4gIHB1YmxpYyBvcHRpb25zOiBDb25zb2xlT3B0aW9ucztcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBDb25zb2xlT3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb25zLmJhY2tncm91bmRDb2xvciB8fCBcInRyYW5zcGFyZW50XCI7XHJcbiAgICB0aGlzLnRleHQgPSBvcHRpb25zLnRleHQgfHwgXCJ0ZXh0XCI7XHJcbiAgICB0aGlzLmRlZmF1bHRTdHlsZSA9IG9wdGlvbnMuc3R5bGUgfHwge307XHJcbiAgICB0aGlzLmZvbnRTaXplID0gb3B0aW9ucy5mb250U2l6ZSB8fCBcIjEycHhcIjtcclxuICAgIHRoaXMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IFwiI2ZmZlwiO1xyXG4gICAgdGhpcy5yYWRpdXMgPSBvcHRpb25zLnJhZGl1cyB8fCBcIjJweFwiO1xyXG4gICAgdGhpcy5wYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nIHx8IFwiM3B4IDVweFwiO1xyXG4gICAgdGhpcy5tYXJnaW4gPSBvcHRpb25zLm1hcmdpbiB8fCBcIjAgNXB4IDAgMFwiO1xyXG5cclxuICAgIHRoaXMucHJpbWFyeUNvbG9yID0gb3B0aW9ucy5wcmltYXJ5Q29sb3IgfHwgXCIjMTY1REZGXCI7XHJcbiAgICB0aGlzLmRhbmdlckNvbG9yID0gb3B0aW9ucy5kYW5nZXJDb2xvciB8fCBcIiNEQzM1NDVcIjtcclxuICAgIHRoaXMuZXJyb3JDb2xvciA9IG9wdGlvbnMuZXJyb3JDb2xvciB8fCBcInJnYigyNDUsIDEwOCwgMTA4KVwiO1xyXG4gICAgdGhpcy5pbmZvQ29sb3IgPSBvcHRpb25zLmluZm9Db2xvciB8fCBcInJnYigxNDQsIDE0NywgMTUzKVwiO1xyXG4gICAgdGhpcy53YXJuQ29sb3IgPSBvcHRpb25zLndhcm5Db2xvciB8fCBcInJnYigyMzAsIDE2MiwgNjApXCI7XHJcbiAgICB0aGlzLnN1Y2Nlc3NDb2xvciA9IG9wdGlvbnMuc3VjY2Vzc0NvbG9yIHx8IFwicmdiKDEwMywgMTk0LCA1OClcIjtcclxuXHJcbiAgICB0aGlzLmludGVyY2VwdG9yID0gb3B0aW9ucy5pbnRlcmNlcHRvcjtcclxuICAgIHRoaXMuX25vQ29uc29sZSA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc3R5bGUob3B0aW9uczogQ29uc29sZU9wdGlvbnMpOiBDU1NQcm9wZXJ0aWVzIHtcclxuICAgIGxldCBzdHlsZTogQ1NTUHJvcGVydGllcyA9IHt9O1xyXG4gICAgbGV0IHN0eWxlT2JqZWN0OiBDU1NQcm9wZXJ0aWVzID0ge307XHJcbiAgICBjb25zdCBvcHRpb25zU3R5bGU6IENTU1Byb3BlcnRpZXMgPSBvcHRpb25zLnN0eWxlO1xyXG4gICAgc3R5bGUuYm9yZGVyUmFkaXVzID0gb3B0aW9ucy5yYWRpdXMgfHwgdGhpcy5yYWRpdXM7XHJcbiAgICBbXCJmb250U2l6ZVwiLCBcImNvbG9yXCIsIFwicGFkZGluZ1wiLCBcImJhY2tncm91bmRDb2xvclwiLCBcIm1hcmdpblwiXS5mb3JFYWNoKFxyXG4gICAgICAoa2V5KSA9PiB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCB2YWx1ZSA9IG9wdGlvbnNba2V5XSB8fCB0aGlzW2tleV07XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBzdHlsZVtrZXldID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICBzdHlsZSA9IHtcclxuICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIC4uLnRoaXMuZGVmYXVsdFN0eWxlLFxyXG4gICAgICAuLi5vcHRpb25zU3R5bGUsXHJcbiAgICB9O1xyXG4gICAgZm9yIChsZXQga2V5IGluIHN0eWxlKSB7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgc3R5bGVPYmplY3RbdG9DYW1lbENhc2Uoa2V5KV0gPSBzdHlsZVtrZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0eWxlT2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfbG9nKGFyZ3M6IExvZ09wdGlub3MgfCBBcnJheTxMb2dPcHRpbm9zPiwgbm9Db25zb2xlPzogYm9vbGVhbikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmdzICE9PSBcIm9iamVjdFwiIHx8IGFyZ3MgPT09IG51bGwpIHJldHVybjtcclxuICAgIGNvbnN0IGxvZ1BhcmFtc0FycmF5OiBBcnJheTxMb2dPcHRpbm9zPiA9IFtdO1xyXG5cclxuICAgIC8vIGluaXQgb2JqZWN0XHJcbiAgICBsZXQgb3B0aW9ucyA9IGxvZ1BhcmFtc0FycmF5LmNvbmNhdChhcmdzKS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgdGV4dCA9IGAke2lzVW5kZWYoaXRlbS50ZXh0KSA/IHRoaXMudGV4dCA6IGl0ZW0udGV4dH1gO1xyXG4gICAgICBjb25zdCBzdHlsZSA9IHRoaXMuX3N0eWxlKGl0ZW0pO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGl0ZW0udHlwZSxcclxuICAgICAgICB0ZXh0LFxyXG4gICAgICAgIHN0eWxlLFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc29tZSBvYmplY3RcclxuICAgIGNvbnN0IHRleHRzID0gb3B0aW9ucy5tYXAoKGl0ZW0pID0+IGAlYyR7aXRlbS50ZXh0fWApO1xyXG4gICAgY29uc3Qgc3R5bGVzOiBBcnJheTxDU1NQcm9wZXJ0aWVzPiA9IG9wdGlvbnMubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0eWxlID0gT2JqZWN0LmtleXMoaXRlbS5zdHlsZSkucmVkdWNlKChsYXN0LCBuZXh0KSA9PiB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxhc3RbY2FtZWxUb0tlYmFiKG5leHQpXSA9IGl0ZW0uc3R5bGVbbmV4dF07XHJcbiAgICAgICAgcmV0dXJuIGxhc3Q7XHJcbiAgICAgIH0sIHt9KTtcclxuICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbGFzdCBvYmplY3RcclxuICAgIGNvbnN0IHN0clRleHRzID0gdGV4dHMuam9pbihcIlwiKTtcclxuICAgIGNvbnN0IHN0clN0eWxlcyA9IHN0eWxlcy5tYXAoKHN0eWxlKSA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgT2JqZWN0LmtleXMoc3R5bGUpXHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAubWFwKChrZXkpID0+IGAke2tleX06JHtzdHlsZVtrZXldfTtgKVxyXG4gICAgICAgICAgLmpvaW4oXCJcIilcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNvbnNvbGVcclxuICAgIGNvbnN0IGlzY29uID0gaXNVbmRlZihub0NvbnNvbGUpID8gdGhpcy5vcHRpb25zLm5vQ29uc29sZSA6IG5vQ29uc29sZTtcclxuICAgIGxldCBsb2dSZXR1cm46IExvZ1JldHVybiA9IHtcclxuICAgICAgbm9Db25zb2xlOiBpc2NvbixcclxuICAgICAgbG9nQXJnczogW3N0clRleHRzLCAuLi5zdHJTdHlsZXNdLFxyXG4gICAgICBhcmdzLFxyXG4gICAgICB0ZXh0cyxcclxuICAgICAgb3B0aW9ucyxcclxuICAgICAgc3R5bGVzLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBpbnRlcmNlcHRvclxyXG4gICAgaWYgKCF0aGlzLl9ub0NvbnNvbGUpIHtcclxuICAgICAgaWYgKHRoaXMuaW50ZXJjZXB0b3IgJiYgdHlwZW9mIHRoaXMuaW50ZXJjZXB0b3IgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmludGVyY2VwdG9yKGxvZ1JldHVybik7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgbG9nUmV0dXJuID0gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAhbG9nUmV0dXJuLm5vQ29uc29sZSAmJiBjb25zb2xlLmxvZyhzdHJUZXh0cywgLi4uc3RyU3R5bGVzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbG9nUmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaW1nKFxyXG4gICAgdXJsOiBzdHJpbmcsXHJcbiAgICB3aWR0aCA9IFwiMTAwcHhcIixcclxuICAgIGhlaWdodCA9IFwiMTAwcHhcIixcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcyxcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW5cclxuICApOiBMb2dSZXR1cm4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZyhcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IFwiIFwiLFxyXG4gICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnBhcmVudFwiLFxyXG4gICAgICAgICAgcGFkZGluZzogYCR7aGVpZ2h0fSAke3dpZHRofWAsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogXCJjb250YWluXCIsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiBcIm5vLXJlcGVhdFwiLFxyXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dXJsfSlgLFxyXG4gICAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0eXBlOiBcImltZ1wiLFxyXG4gICAgICB9LFxyXG4gICAgICBub0NvbnNvbGVcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBlcnJvcih0ZXh0Pzogc3RyaW5nLCBzdHlsZT86IENTU1Byb3BlcnRpZXMsIG5vQ29uc29sZT86IGJvb2xlYW4pOiBMb2dSZXR1cm4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZyh7XHJcbiAgICAgIHRleHQ6IHRleHQgfHwgXCJlcnJvclwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuZXJyb3JDb2xvcixcclxuICAgICAgc3R5bGUsXHJcbiAgICAgIHR5cGU6IFwiZXJyb3JcIixcclxuICAgIH0sbm9Db25zb2xlKTtcclxuICB9XHJcblxyXG4gIGRhbmdlcih0ZXh0Pzogc3RyaW5nLCBzdHlsZT86IENTU1Byb3BlcnRpZXMsIG5vQ29uc29sZT86IGJvb2xlYW4pOiBMb2dSZXR1cm4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZyh7XHJcbiAgICAgIHRleHQ6IHRleHQgfHwgXCJkYW5nZXJcIixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmRhbmdlckNvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJkYW5nZXJcIixcclxuICAgIH0sbm9Db25zb2xlKTtcclxuICB9XHJcblxyXG4gIGluZm8odGV4dD86IHN0cmluZywgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLCBub0NvbnNvbGU/OiBib29sZWFuKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwiaW5mb1wiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuaW5mb0NvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJpbmZvXCIsXHJcbiAgICB9LCBub0NvbnNvbGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpbWFyeShcclxuICAgIHRleHQ/OiBzdHJpbmcsXHJcbiAgICBzdHlsZT86IENTU1Byb3BlcnRpZXMsXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwicHJpbWFyeVwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJpbWFyeUNvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJwcmltYXJ5XCIsXHJcbiAgICB9LG5vQ29uc29sZSk7XHJcbiAgfVxyXG5cclxuICBsb2codGV4dD86IHN0cmluZywgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLCBub0NvbnNvbGU/OiBib29sZWFuKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwibG9nXCIsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICBjb2xvcjogXCIjMzMzXCIsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICB0eXBlOiBcImxvZ1wiLFxyXG4gICAgfSxub0NvbnNvbGUpO1xyXG4gIH1cclxuXHJcbiAgc3VjY2VzcyhcclxuICAgIHRleHQ/OiBzdHJpbmcsXHJcbiAgICBzdHlsZT86IENTU1Byb3BlcnRpZXMsXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwic3VjY2Vzc1wiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuc3VjY2Vzc0NvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICB9LG5vQ29uc29sZSk7XHJcbiAgfVxyXG5cclxuICB3YXJuKHRleHQ/OiBzdHJpbmcsIHN0eWxlPzogQ1NTUHJvcGVydGllcywgbm9Db25zb2xlPzogYm9vbGVhbik6IExvZ1JldHVybiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nKHtcclxuICAgICAgdGV4dDogdGV4dCB8fCBcIndhcm5cIixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLndhcm5Db2xvcixcclxuICAgICAgc3R5bGUsXHJcbiAgICAgIHR5cGU6IFwid2FyblwiLFxyXG4gICAgfSwgbm9Db25zb2xlKTtcclxuICB9XHJcblxyXG4gIGltZyhcclxuICAgIHVybDogc3RyaW5nLFxyXG4gICAgd2lkdGg6IHN0cmluZyxcclxuICAgIGhlaWdodDogc3RyaW5nLFxyXG4gICAgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLFxyXG4gICAgbm9Db25zb2xlPzogYm9vbGVhblxyXG4gICk6IExvZ1JldHVybjtcclxuXHJcbiAgaW1nKHBhcmFtczoge1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICB3aWR0aD86IHN0cmluZztcclxuICAgIGhlaWdodD86IHN0cmluZztcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcztcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW47XHJcbiAgfSk6IExvZ1JldHVybjtcclxuXHJcbiAgaW1nKFxyXG4gICAgcGFyYW1zOiBhbnksXHJcbiAgICB3aWR0aD86IHN0cmluZyxcclxuICAgIGhlaWdodD86IHN0cmluZyxcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcyxcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW5cclxuICApOiBMb2dSZXR1cm4ge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2ltZyhwYXJhbXMsIHdpZHRoLCBoZWlnaHQsIHN0eWxlLCBub0NvbnNvbGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgY29uc3QgeyB1cmwsIHdpZHRoLCBoZWlnaHQsIHN0eWxlIH0gPSBwYXJhbXM7XHJcbiAgICAgIHJldHVybiB0aGlzLl9pbWcodXJsLCB3aWR0aCwgaGVpZ2h0LCBzdHlsZSwgbm9Db25zb2xlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcm93KGZuOiBMb2dPcHRpbm9zIHwgQXJyYXk8TG9nT3B0aW5vcz4pOiBMb2dSZXR1cm47XHJcbiAgcm93KGZuOiAoKSA9PiBBcnJheTxMb2dSZXR1cm4+KTogTG9nUmV0dXJuO1xyXG4gIHJvdyhcclxuICAgIGZuOiAoKCkgPT4gQXJyYXk8TG9nUmV0dXJuPikgfCBMb2dPcHRpbm9zIHwgQXJyYXk8TG9nT3B0aW5vcz4sXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIGxldCBsb2dwYXJhbXM6IExvZ09wdGlub3MgfCBBcnJheTxMb2dPcHRpbm9zPjtcclxuICAgIGlmICh0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICB0aGlzLl9ub0NvbnNvbGUgPSB0cnVlO1xyXG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5fbG9nKGZuKCkubWFwKChpdGVtKSA9PiBpdGVtLmFyZ3MgYXMgTG9nT3B0aW5vcykpO1xyXG4gICAgICB0aGlzLl9ub0NvbnNvbGUgPSBmYWxzZTtcclxuICAgICAgbG9ncGFyYW1zID0gcmVzdWx0LmFyZ3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2dwYXJhbXMgPSBmbjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9sb2cobG9ncGFyYW1zLCBub0NvbnNvbGUpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBTSxTQUFVLFdBQVcsQ0FBQyxHQUFXLEVBQUE7SUFDbkMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFSyxTQUFVLFlBQVksQ0FBQyxlQUF1QixFQUFB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