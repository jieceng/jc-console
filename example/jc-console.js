
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JcConsole = factory());
})(this, (function () { 'use strict';

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
            this.backgroundColor = options.backgroundColor || "rgba(0,0,0)";
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
                noConsole,
            });
        }
        danger(text, style, noConsole) {
            return this._log({
                text: text || "danger",
                backgroundColor: this.dangerColor,
                style,
                type: "danger",
                noConsole,
            });
        }
        info(text, style, noConsole) {
            return this._log({
                text: text || "info",
                backgroundColor: this.infoColor,
                style,
                type: "info",
                noConsole,
            });
        }
        primary(text, style, noConsole) {
            return this._log({
                text: text || "primary",
                backgroundColor: this.primaryColor,
                style,
                type: "primary",
                noConsole,
            });
        }
        log(text, style, noConsole) {
            return this._log({
                text: text || "log",
                backgroundColor: "transparent",
                color: "#333",
                style,
                type: "log",
                noConsole,
            });
        }
        success(text, style, noConsole) {
            return this._log({
                text: text || "success",
                backgroundColor: this.successColor,
                style,
                type: "success",
                noConsole,
            });
        }
        warn(text, style, noConsole) {
            return this._log({
                text: text || "warn",
                backgroundColor: this.warnColor,
                style,
                type: "warn",
                noConsole,
            });
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

    return JcConsole;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamMtY29uc29sZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZShzdHI6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXy1dXFx3L2csIG1hdGNoID0+IG1hdGNoLmNoYXJBdCgxKS50b1VwcGVyQ2FzZSgpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsVG9LZWJhYihjYW1lbENhc2VTdHJpbmc6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGNhbWVsQ2FzZVN0cmluZy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZih2YWx1ZTogYW55KXtcclxuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkXHJcbn0iLCJpbXBvcnQgdHlwZSB7IFByb3BlcnRpZXMgYXMgQ1NTUHJvcGVydGllcyB9IGZyb20gXCJjc3N0eXBlXCI7XHJcbmltcG9ydCB7IHRvQ2FtZWxDYXNlLCBjYW1lbFRvS2ViYWIsIGlzVW5kZWYgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5leHBvcnQgaW50ZXJmYWNlIFN0eWxlT3B0aW9ucyB7XHJcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gIGZvbnRTaXplPzogc3RyaW5nO1xyXG4gIGNvbG9yPzogc3RyaW5nO1xyXG4gIHJhZGl1cz86IHN0cmluZztcclxuICBwYWRkaW5nPzogc3RyaW5nO1xyXG4gIG1hcmdpbj86IHN0cmluZztcclxuICBzdHlsZT86IENTU1Byb3BlcnRpZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGV4dE9wdGlvbnMge1xyXG4gIHRleHQ/OiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBUaGVtZUNvbG9yIHtcclxuICBwcmltYXJ5Q29sb3I/OiBzdHJpbmc7XHJcbiAgZGFuZ2VyQ29sb3I/OiBzdHJpbmc7XHJcbiAgZXJyb3JDb2xvcj86IHN0cmluZztcclxuICBpbmZvQ29sb3I/OiBzdHJpbmc7XHJcbiAgd2FybkNvbG9yPzogc3RyaW5nO1xyXG4gIHN1Y2Nlc3NDb2xvcj86IHN0cmluZztcclxufVxyXG5leHBvcnQgdHlwZSBpbnRlcmNlcHRvck9wdGlvbnMgPSBBcnJheTx7XHJcbiAgdGV4dDogc3RyaW5nO1xyXG4gIHN0eWxlOiBDU1NQcm9wZXJ0aWVzO1xyXG4gIHR5cGU6IHN0cmluZztcclxufT47XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEpjQ29uc29sZUNvbmZpZyB7XHJcbiAgaW50ZXJjZXB0b3I/OiAob3B0aW9uczogTG9nUmV0dXJuKSA9PiBMb2dSZXR1cm4gfCB2b2lkO1xyXG4gIHR5cGU/OiBzdHJpbmc7XHJcbiAgbm9Db25zb2xlPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSmNDb25zb2xlT3B0aW9ucyA9IFN0eWxlT3B0aW9ucyAmXHJcbiAgVGV4dE9wdGlvbnMgJlxyXG4gIFRoZW1lQ29sb3IgJlxyXG4gIEpjQ29uc29sZUNvbmZpZztcclxuXHJcbmV4cG9ydCB0eXBlIExvZ09wdGlub3MgPSBTdHlsZU9wdGlvbnMgJlxyXG4gIFRleHRPcHRpb25zICZcclxuICBPbWl0PEpjQ29uc29sZUNvbmZpZywgXCJpbnRlcmNlcHRvclwiPjtcclxuXHJcbmV4cG9ydCB0eXBlIExvZ1JldHVybiA9IHtcclxuICBub0NvbnNvbGU6IGJvb2xlYW47XHJcbiAgbG9nQXJnczogQXJyYXk8c3RyaW5nPjtcclxuICBzdHlsZXM6IEFycmF5PENTU1Byb3BlcnRpZXM+O1xyXG4gIHRleHRzOiBBcnJheTxzdHJpbmc+O1xyXG4gIGFyZ3M6IExvZ09wdGlub3MgfCBBcnJheTxMb2dPcHRpbm9zPjtcclxuICBvcHRpb25zOiBBcnJheTxQaWNrPExvZ09wdGlub3MsIFwic3R5bGVcIiB8IFwidHlwZVwiIHwgXCJ0ZXh0XCI+PjtcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSmNDb25zb2xlIHtcclxuICBwdWJsaWMgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICBwdWJsaWMgZm9udFNpemU6IHN0cmluZztcclxuICBwdWJsaWMgY29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgcmFkaXVzOiBzdHJpbmc7XHJcbiAgcHVibGljIHBhZGRpbmc6IHN0cmluZztcclxuICBwdWJsaWMgbWFyZ2luOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyBwcmltYXJ5Q29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgZGFuZ2VyQ29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgZXJyb3JDb2xvcjogc3RyaW5nO1xyXG4gIHB1YmxpYyBpbmZvQ29sb3I6IHN0cmluZztcclxuICBwdWJsaWMgd2FybkNvbG9yOiBzdHJpbmc7XHJcbiAgcHVibGljIHN1Y2Nlc3NDb2xvcjogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgZGVmYXVsdFN0eWxlOiBDU1NQcm9wZXJ0aWVzO1xyXG5cclxuICBwdWJsaWMgaW50ZXJjZXB0b3I6IEpjQ29uc29sZUNvbmZpZ1tcImludGVyY2VwdG9yXCJdO1xyXG4gIHB1YmxpYyBfbm9Db25zb2xlOiBib29sZWFuO1xyXG4gIHB1YmxpYyBvcHRpb25zOiBKY0NvbnNvbGVPcHRpb25zO1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEpjQ29uc29sZU9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgfHwgXCJyZ2JhKDAsMCwwKVwiO1xyXG4gICAgdGhpcy50ZXh0ID0gb3B0aW9ucy50ZXh0IHx8IFwidGV4dFwiO1xyXG4gICAgdGhpcy5kZWZhdWx0U3R5bGUgPSBvcHRpb25zLnN0eWxlIHx8IHt9O1xyXG4gICAgdGhpcy5mb250U2l6ZSA9IG9wdGlvbnMuZm9udFNpemUgfHwgXCIxMnB4XCI7XHJcbiAgICB0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCBcIiNmZmZcIjtcclxuICAgIHRoaXMucmFkaXVzID0gb3B0aW9ucy5yYWRpdXMgfHwgXCIycHhcIjtcclxuICAgIHRoaXMucGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyB8fCBcIjNweCA1cHhcIjtcclxuICAgIHRoaXMubWFyZ2luID0gb3B0aW9ucy5tYXJnaW4gfHwgXCIwIDVweCAwIDBcIjtcclxuICAgIHRoaXMucHJpbWFyeUNvbG9yID0gb3B0aW9ucy5wcmltYXJ5Q29sb3IgfHwgXCIjMTY1REZGXCI7XHJcbiAgICB0aGlzLmRhbmdlckNvbG9yID0gb3B0aW9ucy5kYW5nZXJDb2xvciB8fCBcIiNEQzM1NDVcIjtcclxuICAgIHRoaXMuZXJyb3JDb2xvciA9IG9wdGlvbnMuZXJyb3JDb2xvciB8fCBcInJnYigyNDUsIDEwOCwgMTA4KVwiO1xyXG4gICAgdGhpcy5pbmZvQ29sb3IgPSBvcHRpb25zLmluZm9Db2xvciB8fCBcInJnYigxNDQsIDE0NywgMTUzKVwiO1xyXG4gICAgdGhpcy53YXJuQ29sb3IgPSBvcHRpb25zLndhcm5Db2xvciB8fCBcInJnYigyMzAsIDE2MiwgNjApXCI7XHJcbiAgICB0aGlzLnN1Y2Nlc3NDb2xvciA9IG9wdGlvbnMuc3VjY2Vzc0NvbG9yIHx8IFwicmdiKDEwMywgMTk0LCA1OClcIjtcclxuICAgIHRoaXMuaW50ZXJjZXB0b3IgPSBvcHRpb25zLmludGVyY2VwdG9yO1xyXG4gICAgdGhpcy5fbm9Db25zb2xlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zdHlsZShvcHRpb25zOiBKY0NvbnNvbGVPcHRpb25zKTogQ1NTUHJvcGVydGllcyB7XHJcbiAgICBsZXQgc3R5bGU6IENTU1Byb3BlcnRpZXMgPSB7fTtcclxuICAgIGxldCBzdHlsZU9iamVjdDogQ1NTUHJvcGVydGllcyA9IHt9O1xyXG4gICAgY29uc3Qgb3B0aW9uc1N0eWxlOiBDU1NQcm9wZXJ0aWVzID0gb3B0aW9ucy5zdHlsZTtcclxuICAgIHN0eWxlLmJvcmRlclJhZGl1cyA9IG9wdGlvbnMucmFkaXVzIHx8IHRoaXMucmFkaXVzO1xyXG4gICAgW1wiZm9udFNpemVcIiwgXCJjb2xvclwiLCBcInBhZGRpbmdcIiwgXCJiYWNrZ3JvdW5kQ29sb3JcIiwgXCJtYXJnaW5cIl0uZm9yRWFjaChcclxuICAgICAgKGtleSkgPT4ge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBsZXQgdmFsdWUgPSBvcHRpb25zW2tleV0gfHwgdGhpc1trZXldO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgc3R5bGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgc3R5bGUgPSB7XHJcbiAgICAgIC4uLnN0eWxlLFxyXG4gICAgICAuLi50aGlzLmRlZmF1bHRTdHlsZSxcclxuICAgICAgLi4ub3B0aW9uc1N0eWxlLFxyXG4gICAgfTtcclxuICAgIGZvciAobGV0IGtleSBpbiBzdHlsZSkge1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHN0eWxlT2JqZWN0W3RvQ2FtZWxDYXNlKGtleSldID0gc3R5bGVba2V5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHlsZU9iamVjdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2xvZyhhcmdzOiBMb2dPcHRpbm9zIHwgQXJyYXk8TG9nT3B0aW5vcz4sIG5vQ29uc29sZT86IGJvb2xlYW4pIHtcclxuICAgIGlmICh0eXBlb2YgYXJncyAhPT0gXCJvYmplY3RcIiB8fCBhcmdzID09PSBudWxsKSByZXR1cm47XHJcbiAgICBjb25zdCBsb2dQYXJhbXNBcnJheTogQXJyYXk8TG9nT3B0aW5vcz4gPSBbXTtcclxuXHJcbiAgICAvLyBpbml0IG9iamVjdFxyXG4gICAgbGV0IG9wdGlvbnMgPSBsb2dQYXJhbXNBcnJheS5jb25jYXQoYXJncykubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRleHQgPSBgJHtpc1VuZGVmKGl0ZW0udGV4dCkgPyB0aGlzLnRleHQgOiBpdGVtLnRleHR9YDtcclxuICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLl9zdHlsZShpdGVtKTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBpdGVtLnR5cGUsXHJcbiAgICAgICAgdGV4dCxcclxuICAgICAgICBzdHlsZSxcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHNvbWUgb2JqZWN0XHJcbiAgICBjb25zdCB0ZXh0cyA9IG9wdGlvbnMubWFwKChpdGVtKSA9PiBgJWMke2l0ZW0udGV4dH1gKTtcclxuICAgIGNvbnN0IHN0eWxlczogQXJyYXk8Q1NTUHJvcGVydGllcz4gPSBvcHRpb25zLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5rZXlzKGl0ZW0uc3R5bGUpLnJlZHVjZSgobGFzdCwgbmV4dCkgPT4ge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBsYXN0W2NhbWVsVG9LZWJhYihuZXh0KV0gPSBpdGVtLnN0eWxlW25leHRdO1xyXG4gICAgICAgIHJldHVybiBsYXN0O1xyXG4gICAgICB9LCB7fSk7XHJcbiAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGxhc3Qgb2JqZWN0XHJcbiAgICBjb25zdCBzdHJUZXh0cyA9IHRleHRzLmpvaW4oXCJcIik7XHJcbiAgICBjb25zdCBzdHJTdHlsZXMgPSBzdHlsZXMubWFwKChzdHlsZSkgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlKVxyXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgLm1hcCgoa2V5KSA9PiBgJHtrZXl9OiR7c3R5bGVba2V5XX07YClcclxuICAgICAgICAgIC5qb2luKFwiXCIpXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjb25zb2xlXHJcbiAgICBjb25zdCBpc2NvbiA9IGlzVW5kZWYobm9Db25zb2xlKSA/IHRoaXMub3B0aW9ucy5ub0NvbnNvbGUgOiBub0NvbnNvbGU7XHJcbiAgICBsZXQgbG9nUmV0dXJuOiBMb2dSZXR1cm4gPSB7XHJcbiAgICAgIG5vQ29uc29sZTogaXNjb24sXHJcbiAgICAgIGxvZ0FyZ3M6IFtzdHJUZXh0cywgLi4uc3RyU3R5bGVzXSxcclxuICAgICAgYXJncyxcclxuICAgICAgdGV4dHMsXHJcbiAgICAgIG9wdGlvbnMsXHJcbiAgICAgIHN0eWxlcyxcclxuICAgIH07XHJcblxyXG4gICAgLy8gaW50ZXJjZXB0b3JcclxuICAgIGlmICghdGhpcy5fbm9Db25zb2xlKSB7XHJcbiAgICAgIGlmICh0aGlzLmludGVyY2VwdG9yICYmIHR5cGVvZiB0aGlzLmludGVyY2VwdG9yID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pbnRlcmNlcHRvcihsb2dSZXR1cm4pO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgIGxvZ1JldHVybiA9IHJlcztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgIWxvZ1JldHVybi5ub0NvbnNvbGUgJiYgY29uc29sZS5sb2coc3RyVGV4dHMsIC4uLnN0clN0eWxlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvZ1JldHVybjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2ltZyhcclxuICAgIHVybDogc3RyaW5nLFxyXG4gICAgd2lkdGggPSBcIjEwMHB4XCIsXHJcbiAgICBoZWlnaHQgPSBcIjEwMHB4XCIsXHJcbiAgICBzdHlsZT86IENTU1Byb3BlcnRpZXMsXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIiBcIixcclxuICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5wYXJlbnRcIixcclxuICAgICAgICAgIHBhZGRpbmc6IGAke2hlaWdodH0gJHt3aWR0aH1gLFxyXG4gICAgICAgICAgYmFja2dyb3VuZFNpemU6IFwiY29udGFpblwiLFxyXG4gICAgICAgICAgYmFja2dyb3VuZFJlcGVhdDogXCJuby1yZXBlYXRcIixcclxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3VybH0pYCxcclxuICAgICAgICAgIC4uLnN0eWxlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHlwZTogXCJpbWdcIixcclxuICAgICAgfSxcclxuICAgICAgbm9Db25zb2xlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZXJyb3IodGV4dD86IHN0cmluZywgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLCBub0NvbnNvbGU/OiBib29sZWFuKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwiZXJyb3JcIixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmVycm9yQ29sb3IsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICB0eXBlOiBcImVycm9yXCIsXHJcbiAgICAgIG5vQ29uc29sZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGFuZ2VyKHRleHQ/OiBzdHJpbmcsIHN0eWxlPzogQ1NTUHJvcGVydGllcywgbm9Db25zb2xlPzogYm9vbGVhbik6IExvZ1JldHVybiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nKHtcclxuICAgICAgdGV4dDogdGV4dCB8fCBcImRhbmdlclwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuZGFuZ2VyQ29sb3IsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICB0eXBlOiBcImRhbmdlclwiLFxyXG4gICAgICBub0NvbnNvbGUsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluZm8odGV4dD86IHN0cmluZywgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLCBub0NvbnNvbGU/OiBib29sZWFuKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwiaW5mb1wiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuaW5mb0NvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJpbmZvXCIsXHJcbiAgICAgIG5vQ29uc29sZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpbWFyeShcclxuICAgIHRleHQ/OiBzdHJpbmcsXHJcbiAgICBzdHlsZT86IENTU1Byb3BlcnRpZXMsXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2coe1xyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IFwicHJpbWFyeVwiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJpbWFyeUNvbG9yLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJwcmltYXJ5XCIsXHJcbiAgICAgIG5vQ29uc29sZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbG9nKHRleHQ/OiBzdHJpbmcsIHN0eWxlPzogQ1NTUHJvcGVydGllcywgbm9Db25zb2xlPzogYm9vbGVhbik6IExvZ1JldHVybiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nKHtcclxuICAgICAgdGV4dDogdGV4dCB8fCBcImxvZ1wiLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgY29sb3I6IFwiIzMzM1wiLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgdHlwZTogXCJsb2dcIixcclxuICAgICAgbm9Db25zb2xlLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdWNjZXNzKFxyXG4gICAgdGV4dD86IHN0cmluZyxcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcyxcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW5cclxuICApOiBMb2dSZXR1cm4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZyh7XHJcbiAgICAgIHRleHQ6IHRleHQgfHwgXCJzdWNjZXNzXCIsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5zdWNjZXNzQ29sb3IsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgbm9Db25zb2xlLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB3YXJuKHRleHQ/OiBzdHJpbmcsIHN0eWxlPzogQ1NTUHJvcGVydGllcywgbm9Db25zb2xlPzogYm9vbGVhbik6IExvZ1JldHVybiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nKHtcclxuICAgICAgdGV4dDogdGV4dCB8fCBcIndhcm5cIixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLndhcm5Db2xvcixcclxuICAgICAgc3R5bGUsXHJcbiAgICAgIHR5cGU6IFwid2FyblwiLFxyXG4gICAgICBub0NvbnNvbGUsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGltZyhcclxuICAgIHVybDogc3RyaW5nLFxyXG4gICAgd2lkdGg6IHN0cmluZyxcclxuICAgIGhlaWdodDogc3RyaW5nLFxyXG4gICAgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzLFxyXG4gICAgbm9Db25zb2xlPzogYm9vbGVhblxyXG4gICk6IExvZ1JldHVybjtcclxuXHJcbiAgaW1nKHBhcmFtczoge1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICB3aWR0aD86IHN0cmluZztcclxuICAgIGhlaWdodD86IHN0cmluZztcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcztcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW47XHJcbiAgfSk6IExvZ1JldHVybjtcclxuXHJcbiAgaW1nKFxyXG4gICAgcGFyYW1zOiBhbnksXHJcbiAgICB3aWR0aD86IHN0cmluZyxcclxuICAgIGhlaWdodD86IHN0cmluZyxcclxuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllcyxcclxuICAgIG5vQ29uc29sZT86IGJvb2xlYW5cclxuICApOiBMb2dSZXR1cm4ge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2ltZyhwYXJhbXMsIHdpZHRoLCBoZWlnaHQsIHN0eWxlLCBub0NvbnNvbGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgY29uc3QgeyB1cmwsIHdpZHRoLCBoZWlnaHQsIHN0eWxlIH0gPSBwYXJhbXM7XHJcbiAgICAgIHJldHVybiB0aGlzLl9pbWcodXJsLCB3aWR0aCwgaGVpZ2h0LCBzdHlsZSwgbm9Db25zb2xlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcm93KGZuOiBMb2dPcHRpbm9zIHwgQXJyYXk8TG9nT3B0aW5vcz4pOiBMb2dSZXR1cm47XHJcbiAgcm93KGZuOiAoKSA9PiBBcnJheTxMb2dSZXR1cm4+KTogTG9nUmV0dXJuO1xyXG4gIHJvdyhcclxuICAgIGZuOiAoKCkgPT4gQXJyYXk8TG9nUmV0dXJuPikgfCBMb2dPcHRpbm9zIHwgQXJyYXk8TG9nT3B0aW5vcz4sXHJcbiAgICBub0NvbnNvbGU/OiBib29sZWFuXHJcbiAgKTogTG9nUmV0dXJuIHtcclxuICAgIGxldCBsb2dwYXJhbXM6IExvZ09wdGlub3MgfCBBcnJheTxMb2dPcHRpbm9zPjtcclxuICAgIGlmICh0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICB0aGlzLl9ub0NvbnNvbGUgPSB0cnVlO1xyXG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5fbG9nKGZuKCkubWFwKChpdGVtKSA9PiBpdGVtLmFyZ3MgYXMgTG9nT3B0aW5vcykpO1xyXG4gICAgICB0aGlzLl9ub0NvbnNvbGUgPSBmYWxzZTtcclxuICAgICAgbG9ncGFyYW1zID0gcmVzdWx0LmFyZ3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2dwYXJhbXMgPSBmbjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9sb2cobG9ncGFyYW1zLCBub0NvbnNvbGUpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFBTSxTQUFVLFdBQVcsQ0FBQyxHQUFXLEVBQUE7UUFDbkMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFSyxTQUFVLFlBQVksQ0FBQyxlQUF1QixFQUFBO1FBQ2hELE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3RSxDQUFDO0lBRUssU0FBVSxPQUFPLENBQUMsS0FBVSxFQUFBO1FBQzlCLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQTtJQUM5Qjs7SUMwQ2MsTUFBTyxTQUFTLENBQUE7SUFDckIsSUFBQSxlQUFlLENBQVM7SUFDeEIsSUFBQSxJQUFJLENBQVM7SUFDYixJQUFBLFFBQVEsQ0FBUztJQUNqQixJQUFBLEtBQUssQ0FBUztJQUNkLElBQUEsTUFBTSxDQUFTO0lBQ2YsSUFBQSxPQUFPLENBQVM7SUFDaEIsSUFBQSxNQUFNLENBQVM7SUFFZixJQUFBLFlBQVksQ0FBUztJQUNyQixJQUFBLFdBQVcsQ0FBUztJQUNwQixJQUFBLFVBQVUsQ0FBUztJQUNuQixJQUFBLFNBQVMsQ0FBUztJQUNsQixJQUFBLFNBQVMsQ0FBUztJQUNsQixJQUFBLFlBQVksQ0FBUztJQUVyQixJQUFBLFlBQVksQ0FBZ0I7SUFFNUIsSUFBQSxXQUFXLENBQWlDO0lBQzVDLElBQUEsVUFBVSxDQUFVO0lBQ3BCLElBQUEsT0FBTyxD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
