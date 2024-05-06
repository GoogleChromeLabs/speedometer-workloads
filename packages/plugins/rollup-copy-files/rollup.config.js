import terser from '@rollup/plugin-terser';
import cleaner from "rollup-plugin-cleaner";

export default {
    input: "index.js",
    output: [
        {
            file: "dist/index.min.js",
            format: "es",
        },
    ],
    plugins: [
        cleaner({
            targets: ["./dist/"],
        }),
        terser(),
    ],
};
