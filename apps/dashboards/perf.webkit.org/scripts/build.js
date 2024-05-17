const { createDirectory, copyDirectory } = require("app-build-scripts");

const build = async () => {
    // create dist folder
    await createDirectory("./dist");

    // copy src folder
    await copyDirectory("./public", "./dist");

    console.log("done!!");
};

build();