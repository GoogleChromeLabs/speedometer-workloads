# sanitize-language

A helper function that parses files in a directory and replaces offensive words with safe alternatives.
This script is used for workloads that depend on older packages that we can't update.

## How to install

This plugin is used internally and can get installed through pnpm workspace.
To manually install the plugin, add the following line to your `devDependencies` in the target's package.json file:

```bash
    "devDependencies": {
        "sanitize-language": "workspace:*"
    }
```

Once done, install the package, by running `pnpm install`.

## How to use

The following script can get added to the scripts key of your package.json file:

```bash
"sanitize": "OUTPUT_FOLDER=./dist node node_modules/sanitize-language/dist/index.min.js",
```

Typically, the script should run after the build step of the workload, to ensure a build script doesn't override the output from the sanitize-language script.
