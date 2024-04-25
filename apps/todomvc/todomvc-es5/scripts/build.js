const { createDirectory, copyDirectory, copyFiles, updateImports } = require("app-build-scripts");

const filesToMove = [
    { src: "index.html", dest: "./dist/index.html" },
    { src: "favicon.ico", dest: "./dist/favicon.ico" },
    { src: "benchmark-connector.min.js", dest: "./dist/benchmark-connector.min.js" },
    { src: "node_modules/todomvc-app-css/index.css", dest: "./dist/index.css" },
];

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