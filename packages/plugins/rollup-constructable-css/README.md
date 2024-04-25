# Rollup Constructable CSS

A rollup plugin that creates constructable stylesheets from one or more css source files.

More information about constructable stylesheets can be found [here](https://web.dev/articles/constructable-stylesheets).

## How to install

This plugin is used internally and can get installed through pnpm workspace.
To manually install the plugin, add the following line to your `devDependencies` in the target's package.json file:

```bash
    "devDependencies": {
        "rollup-constructable-css": "workspace:*"
    }
```

Once done, install the package, by running `pnpm install`.

To use the plugin, import and call the plugin within the plugins array in the `rollup.config.js` file.
The following example uses all files within the `src/css` directory, but omits the `src/css/partials.css` file. 

```JavaScript
import { constructableCSS } from "./node_modules/rollup-constructable-css/dist/index.min.js";

export default {
    plugins: [
        constructableCSS({
            src: ["src/css/*", "!src/css/partials.css"],
            dest: "dist/",
        })
    ],
};
```

## Output Example

The `todomvc-css` package creates constructable css files for any todomvc app that uses web components.
Below is an output example for the app.css file:

app.css

```CSS
:host {
    display: block;
    box-shadow: none !important;
    min-height: 68px;
}

.app {
    background: #fff;
    margin: 24px 16px 40px 16px;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
```

app.constructable.js

```JavaScript
const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host {
    display: block;
    box-shadow: none !important;
    min-height: 68px;
}

.app {
    background: #fff;
    margin: 24px 16px 40px 16px;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
`);
export default sheet;
```
