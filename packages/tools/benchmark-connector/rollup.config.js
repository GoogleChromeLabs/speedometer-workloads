import cleaner from "rollup-plugin-cleaner";
import { copyFiles } from "./node_modules/rollup-copy-files/dist/index.min.js";

export default {
    input: "index.js",
    output: [
        {
            file: "dist/index.js",
            format: "es",
        },
    ],
    plugins: [
        cleaner({
            targets: ["./dist/"],
        }),
        copyFiles({
            src: ["scripts/*"],
            dest: "dist/",
            rename: (name, extension) => `${name}.min.${extension}`,
            minify: true
        }),
    ],
};
