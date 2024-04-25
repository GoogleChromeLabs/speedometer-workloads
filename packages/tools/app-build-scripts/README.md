# app-build-scripts

A collection of helper functions to create a static output for a workload without any bundlers.

## example

The following example is taken from the [todomvc-es5](../../../apps/todomvc/todomvc-es5/README.md) workload.
The [package.json](../../../apps/todomvc/todomvc-es5/package.json) contains a build script that copies and updates all relevant files to a `dist` folder.

[source](../../../apps/todomvc/todomvc-es5/scripts/build.js)

```JavaScript
const { createDirectory, copyDirectory, copyFiles, updateImports } = require("app-build-scripts");

// Array of all files that should get copied over to the dist directory.
const filesToMove = [
    { src: "index.html", dest: "./dist/index.html" },
    { src: "favicon.ico", dest: "./dist/favicon.ico" },
    { src: "benchmark-connector.min.js", dest: "./dist/benchmark-connector.min.js" },
    { src: "node_modules/todomvc-app-css/index.css", dest: "./dist/index.css" },
];

// Array of file references in the index.html file, that need to reflect the new file location.
const importsToRename = [
    {
        src: "node_modules/todomvc-app-css/",
        dest: "",
        files: [ "./dist/index.html" ]
    },
    {
        src: "src/",
        dest: "",
        files: [ "./dist/index.html" ]
    },
];

const build = async () => {
    // create dist folder
    await createDirectory("./dist");

    // copy src folder
    await copyDirectory("./src", "./dist");

    // copy files to Move
    await copyFiles(filesToMove);

    // rename imports files
    for (const entry of importsToRename){
        const { files, src, dest } = entry;
        await updateImports({ files, src, dest });
    }

    console.log("done!!");
};

build();
```
