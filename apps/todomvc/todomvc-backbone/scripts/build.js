const { createDirectory, copyDirectory, copyFiles, updateImports } = require("app-build-scripts");

const filesToMove = [
    { src: "index.html", dest: "./dist/index.html" },
    { src: "favicon.ico", dest: "./dist/favicon.ico" },
    { src: "benchmark-connector.min.js", dest: "./dist/benchmark-connector.min.js" },
    { src: "node_modules/todomvc-app-css/index.css", dest: "./dist/index.css" },
    { src: "node_modules/jquery/dist/jquery.min.js", dest: "./dist/jquery.min.js" },
    { src: "node_modules/underscore/underscore-min.js", dest: "./dist/underscore-min.js" },
    { src: "node_modules/backbone/backbone-min.js", dest: "./dist/backbone-min.js" },
    { src: "node_modules/backbone/backbone-min.js.map", dest: "./dist/backbone-min.js.map" }
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
    {
        src: "node_modules/jquery/dist/",
        dest: "",
        files: [ "./dist/index.html" ]
    },
    {
        src: "node_modules/underscore/",
        dest: "",
        files: [ "./dist/index.html" ]
    },
    {
        src: "node_modules/backbone/",
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
