import fs from "fs-extra";
import path from "path";
import strip from "strip-comments";

/**
 * createConstructableCSSFile
 *
 * Helper function that reads a source css file and creates a constructable JavaScript file in a destination folder.
 *
 * @param {string} src - The source css file.
 * @param {string} dest - The destination folder for the created file.
 */
async function createConstructableCSSFile(src, dest) {
  const contents = await fs.readFile(src, "utf-8");
  const stripped = strip(contents);
  const output = `const sheet = new CSSStyleSheet();\nsheet.replaceSync(\`${stripped}\`);\nexport default sheet;\n`;
  const { name } = path.parse(src);
  const fileName = `${name}.constructable.js`;
  const outputPath = path.join(dest, fileName);
  await fs.createFile(outputPath);
  await fs.writeFile(outputPath, output);
}

/**
 * constructableCSS
 *
 * A rollup plugin that generates constructible css from css files.
 *
 * @param {Object} config - Config to create constructible css.
 * @param {string} config.src - The source css files.
 * @param {string} config.dest - The destination folder for the created files.
 * @param {string} config.hook - The rollup output generation hook {@link https://rollupjs.org/plugin-development/#output-generation-hooks|Rollup Output Generation Hooks}.
 */
function constructableCSS({
  src,
  dest = "dist/",
  hook = "generateBundle",
} = {}) {
  if (!src) throw new Error("src option missing");

  return {
    name: "constructable-css",
    [hook]: async () => {
      const { globby } = await import("globby");
      const matchedPaths = await globby(src, {
        expandDirectories: false,
      });

      await Promise.all(
        matchedPaths.map((src) => createConstructableCSSFile(src, dest))
      );
    },
  };
}

export { constructableCSS };
