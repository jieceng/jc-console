# Jc console

## Use
> npm i jc-console

## Simple code
```js
// commonjs
// const JcConsole = require('jc-console')

// esm
import JcConsole from 'jc-console'
 const url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAIB0lEQVRoge2ZW2xUxxnHfzNzzq69eG1zsV3bXEpMW9ykUMQd20HhYppKVEorFZSHykJN1SoPfaiUhyJVNEKKKvWJVjRCahSlVVB56U3JA2kqKFBCIASSUPDSQCAm2MbXxbf1njPTh7149+w5u2u3pi/5S6MzO7fz/8/3zcx3ZuFz/H8hMhljjDjwm5Guhwl5WEirCTPTyHifOXV4yjJVTeHx6NHn68f+54w9kJlM16+HusaSoVeEtJoyRIJSLoLa9AxNdM43ecgRMO5Yh/0a+Ex2WXWurPzxXEnNBlkBmZmHABeZ5cBWRdWTXYfer50zszKRFWDMTMqWlTmIn2CAfrdq3t1IBlWYgHwxVd4qUVH9/FxIzQYFAvwWqh/KafMo3GjGhQjeYfIKvG38lOSUPUjW7J47vdKw/Ap9Z7fE2ggqq2+qPfHe5Ri1NZWEKyyUBCEEJkd5Jm98ZsPT7r7jmJ+sXLn8eKaswAKzIV9q9gEGp8Lc6psiMZ1M1wmEmFuSUjaGQur1WOzjZwsE+MKjKIh8KR03BqoYGYkzOZUoEO0366UQCqlfZPIzLlRiHAPURgy7WzVrlmkaogYhoD8uuNIjOXlNMjwufPveHImy3RnhYXyMcNhGSjVr0rmwbXtpoYAixAG2tGi6trmEVL7SxlpDY63LjtUuL5+yeP+uLLDUcCJC35hFOKyJj8apqYli2yVfHcwpx2rZUYoZYEuL5rkOJxv59cUFsb6U9325QdNQbRidgLtD+RbI9Y4bA1U0Vo/iuJKxsXGqq6tQ6r+zRJ6AINRGDF3bXATganjtvOIfMZUVLFC0r3L5oEcyOikC10NsOMp2PYJ2DdoYxsfHiUQiWRFzWQsQsIhzw4pdrTrrNn+4aHE6h3ym7ZmbqoC8l8/wdIS+hxZJR6NdjdaGiYkJHMcJJFeOqKKxEMDaZRqA0SnB36579M5yh7oxWEUyqXFdnX6XYWpqqqiIUijqQgZoiKYo3OoXaM+XzasHpn37XfxE8qu3rYJTPDYc5Ul3BDftRiIt4tCx1xHK5sUf7C9J2GsV34Os6IFWhqvayj8ESe1GCsdNuVEuF+06uK4bSDQIJRdxb1ywdKGhpd4gJWg9w+mVszO7SCQE+zelCASdBwDHzw2wIHEJaWmUEggBqS9bw6Fjx5GWQgjpcUPDz7+/z3c8mdPKN139NNWkusKw+6s6zwinY4rTMcWpboXKWR7dfTkCPOvBiaxCABKBkCkBQgqkFAgJGI0xOo98Nu9jlZIWOHlNsqvVJWzDdzc4JF2Lv9+QeQt+2yrNM+tSsx+fhIu3hS95AB1awt6nvsHyJRCptLBthUqrFylz8MdTF4jd6+Nb7RtZ39pSlF/JaHRkUvDbsxY/espBSfjeVoennxDE+gTGQEu9obFmpsdr71hMu6LIDmW4MRilsWaYaQuUkuSeZw8nJon19CIEfGl5Y16/ogKKLZkLtyVgcaDdocKGuqihLprfI+nC788rLnycv9V6yQN0D0eZPH+Kew/6WP94C3s2r0HKVL9zV6+jteZrjy0npCRa62xdUQF+yBX9zi3J9fs2nY9rvr5M84UaEBj6xwQffip467pF36invw95gKFEJdtXrKbnwQOudN9izarlNNct4rOBYa7cvIOUkrY1X8EYQzKZxLKsQBEzFihj1xqdFJy4pDhxyRPDlLjFyPsoST/vJxp44ovL+ejObd44e5ln97Tz1zPvYoxhS+sqFtVEs32TySS2bfuKKP49kPPScj528GnnRx4gNlzD+tUtLI5GGYjHOfbnkwzGx6lbWE3HutaC/o7joNN7eO6YRQ+ykgeaD/m83wHkAYamKhicDLN78zowgqmEg5SS72zfjErPtHfhuq6bFVEgoCSKKPKb9WLkMwX/6l/Aux/dxHVTpFztcv5arOgp7BVR8iArFj74VXlfHkQe4EpvBd13ewkpi92b1hK2La7c/IQ3/3k5K8oP/gLKRJAmv1kviIc8Z0NC1iLsJext28SalhXs29FOyLa5+u87vHHuPbQOtkRZAsoxhJc4fu2KrJXmx9pYUhvFcTWNSxayb+c2wrbNh7fu8pezl/Jm2+9ds4tGPQP5EZ8NeWPg3mR9KrxOh9jNdYvYt3MroZDFtdt3+dOZi77vKhDgJpO95RD2vXwKIm6C22SGGUpUcD+umE662RC7uX4x+3e0EbIs6muq83gECpBMvOAlWkx5oKXK2l7z664PRHEcjatNtm5pw2J++EwnbWtXB5LPE/DmT5t+lxzpf86Znuo12sEv6ZxUUO+mU177JFonMemk3VTK/k4/uwcXYIwo2HmqKiuKkoec/8jmAy/87O3DFz94eNCXhJl5bt4YYe+uehZU2lRUWNnwOkvS55px5cqVAuawjc4G8YnRI0JZCGUhLTuVVDql8x1bqtm7s46QLbEslXfxG+i+fqHEfODlX367f1mTNSCURCiJkOlnOt++ZQFP71hEKKwIhxSpCKJ88vMuAGDF0sgRYUCYlL8KUvmODZXs6ajGUmArgVIy9VnpuXovRh4egYDkyPTRHOoYDW0bKuncXkPIVti2wrJVmnz5M5/BvAt46aVdg82NasAYg9GGto2VdD5ZjaUESgmUJZEimLzfVp5ITN9/ZAIAmhusIxho31hJZ0cUSwksS2bJQ8ABGTDrd3pGDmbyc7/jngXMmD7atsF+ccfWSjCp2wuDQLsGjM7bHr3IrUskEr2f9U0c/Oaeba8+Ct6foxz8B06nhlgscdhjAAAAAElFTkSuQmCC';
        const jo = new JcConsole()
        // simple method console
        jo.success()
        jo.error()
        jo.primary()
        jo.danger()
        jo.warn()
        jo.log() // no style
        jo.info()

        // img console
        jo.img(url, '50px', '50px')

        // row console
        jo.row(() => [
            jo.success(),
            jo.error(),
            jo.primary(),
            jo.danger(),
            jo.warn(),
            jo.log(), // no style
            jo.info(),
            jo.img(url, '50px', '50px')
        ])

```

Console output

![示例](./images/console-img.png)
## Instalce method
> Here are some methods for examples

| method name | description | params | return value | 
|-|-|-|-|
| success | success theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| error | error theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| primary | primary theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| danger | danger theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| warn | warn theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| log | none theme output content in console |text `?:string` <br/> style `?:CSSProperties` <br/>  noConsole `?:boolean` | `LogReturn` |
| img | output image |  params:{<br/> url: string, <br/> width?: string,<br/>height?: string,<br/>style?: CSSProperties,<br/>noConsole?: boolean} \| {<br/> url: string, <br/> width?: string,<br/>height?: string,<br/>style?: CSSProperties,<br/>noConsole?: boolean}  | `LogReturn` |
| row | block output content in console |  fn `:(() => Array<LogReturn>)` \| `LogOptinos` \| `Array<LogOptinos>` <br/> noConsole `?: boolean` | `LogReturn` |

### <mark>CSSProperties</mark> (Type)
> all css Properties 

For example:
```js
{
    color: '#333',
    fontSize: '20px',
    background: 'red',
    ....
}
```
### <mark>ConsoleOptions</mark> (Type)
> `type ConsoleOptions = ThemeColor & ConsoleConfig & LogOptinos;`
```ts
new JcConsole(options: ConsoleOptions)
```

### <mark>LogReturn</mark> (Type)
| propertie name | description | type | 
|-|-|-|
| noConsole | Nothing is output to the console | `boolean`
| logArgs | Use extended symbols to pass values to console.log to print directly. | `Array<Pick<LogOptinos, "style" \| "type" \| "text">>` |
| styles | style list | `Array<CSSProperties>` |
| texts | text list | `Array<string>` | 
| args | original parameters | `LogOptinos` \| `Array<LogOptinos>` |
| options | The raw parameters being processed | `Array<Pick<LogOptinos, "style" \| "type" \| "text">>` |

### <mark>LogOptinos</mark> (Type)
| propertie name | description | type | default value |
|-|-|-|-|
| backgroundColor | merge to style | `string`|
| fontSize | merge to style | `string`|
| color | merge to style | `string`|
| radius | transformat border-radius merge to style | `string`|
| padding | merge to style | `string`|
| margin | merge to style | `string`|
| style | main style | `CSSProperties`|
| text | console output text | `string` |
| type | mark console type | `string` |

### <mark>ThemeColor</mark> (Type)
| propertie name | description | type | default value |
|-|-|-|-|
| primaryColor | primary color | `string`| "#165DFF" |
| dangerColor | danger color | `string`  | "#DC3545" |
| errorColor | error color | `string`| "rgb(245, 108, 108)" | 
| infoColor | info color | `string`| "rgb(144, 147, 153)" |
| warnColor | warn color | `string`| "rgb(230, 162, 60)" |
| successColor | success color | `string`| "rgb(103, 194, 58)" |

### <mark>ConsoleConfig</mark> (Type)
| propertie name | description | type | default value |
|-|-|-|-|
| interceptor | Intercept console data | `(options: LogReturn)=>LogReturn \| void` | - |
| noConsole | no console | `boolean` | `false` |