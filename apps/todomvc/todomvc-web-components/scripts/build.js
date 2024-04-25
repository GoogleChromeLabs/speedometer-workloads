const { createDirectory, copyDirectory, copyFiles, updateImports } = require("app-build-scripts");

const filesToMove = [
    { src: "index.html", dest: "./dist/index.html" },
    { src: "favicon.ico", dest: "./dist/favicon.ico" },
    { src: "benchmark-connector.min.js", dest: "./dist/benchmark-connector.min.js" },
    { src: "node_modules/todomvc-css/dist/global.css", dest: "./dist/styles/global.css" },
    { src: "node_modules/todomvc-css/dist/header.css", dest: "./dist/styles/header.css" },
    { src: "node_modules/todomvc-css/dist/footer.css", dest: "./dist/styles/footer.css" },
    { src: "node_modules/todomvc-css/dist/global.constructable.js", dest: "./dist/styles/global.constructable.js" },
    { src: "node_modules/todomvc-css/dist/app.constructable.js", dest: "./dist/styles/app.constructable.js" },
    { src: "node_modules/todomvc-css/dist/topbar.constructable.js", dest: "./dist/styles/topbar.constructable.js" },
    { src: "node_modules/todomvc-css/dist/main.constructable.js", dest: "./dist/styles/main.constructable.js" },
    { src: "node_modules/todomvc-css/dist/bottombar.constructable.js", dest: "./dist/styles/bottombar.constructable.js" },
    { src: "node_modules/todomvc-css/dist/todo-list.constructable.js", dest: "./dist/styles/todo-list.constructable.js" },
    { src: "node_modules/todomvc-css/dist/todo-item.constructable.js", dest: "./dist/styles/todo-item.constructable.js" },
];

const importsToRename = [
    {
        src: "node_modules/todomvc-css/dist/",
        dest: "styles/",
        files: [ "./dist/index.html" ]
    },
    {
        src: "src/",
        dest: "",
        files: [ "./dist/index.html" ]
    },
    {
        src: "../../../node_modules/todomvc-css/dist/",
        dest: "../../styles/",
        files: [
            "./dist/components/todo-app/todo-app.component.js",
            "./dist/components/todo-bottombar/todo-bottombar.component.js",
            "./dist/components/todo-item/todo-item.component.js",
            "./dist/components/todo-list/todo-list.component.js",
            "./dist/components/todo-topbar/todo-topbar.component.js",
        ],
    }
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
