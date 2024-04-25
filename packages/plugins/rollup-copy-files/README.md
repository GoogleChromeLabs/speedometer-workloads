# Rollup Copy Files

A rollup plugin that copies source files to an output folder.

## How to install

This plugin is used internally and can get installed through pnpm workspace.
To manually install the plugin, add the following line to your `devDependencies` in the target's package.json file:

```bash
    "devDependencies": {
        "rollup-copy-files": "workspace:*"
    }
```

Once done, install the package, by running `pnpm install`.

To use the plugin, import and call the plugin within the plugins array in the `rollup.config.js` file.

```JavaScript
import { copyFiles } from "./node_modules/rollup-copy-files/dist/index.min.js";
```

To copy all files from the `src/css` folder, but omit the `src/css/partials.css` file:

```JavaScript
export default {
    plugins: [
        copyFiles({
            src: ["src/css/*", "!src/css/partials.css"],
            dest: "dist/",
        }),
    ],
};
```

To copy a file and rename it (`src/css/index.css` => `dist/index.module.css`):

```JavaScript
export default {
    plugins: [
        copyFiles({
            src: ["src/css/index.css"],
            dest: "dist/",
            rename: (name, extension) => `${name}.module.${extension}`,
        }),
    ],
};
```

To merge all files from the `src/css` folder into one `dist/index.css` file:

```JavaScript
export default {
    plugins: [
        copyFiles({
            src: ["src/css/*", "!src/css/partials.css"],
            file: "dist/index.css"
        })
    ],
};
```
