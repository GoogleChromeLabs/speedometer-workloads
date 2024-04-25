import fs from "fs-extra";
import path from "path";
import os from "os";
import terser from "terser";

/**
 * ensureContentsEndsWithEmptyLine
 *
 * Helper function to ensure contents always has an empty line at the end.
 *
 * @param {string} contents Content to check.
 * @returns {string} Modified content.
 */
function ensureContentsEndsWithEmptyLine(contents) {
  if (!contents.endsWith(os.EOL)) return contents + os.EOL;
  return contents;
}

/**
 * copyContents
 *
 * Helper function that reads a source file and copies contents to a new location.
 *
 * @param {Object} config - Config to copy file.
 * @param {string} config.src - The source css file.
 * @param {string} config.dest - The destination folder for the created file.
 * @param {rename} config.rename - A function to rename output file.
 * @param {string} config.file - Name for single output file, when merging multiple source files.
 * @param {boolean} config.minify - Flag to minify output file.
 */
async function copyContents(src, dest, rename, file, minify) {
  if (file) {
    let fileContents = "";
    try {
      fileContents = fs.readFileSync(file, "utf-8");
    } catch (e) {
      fs.createFileSync(file);
    }
    const srcContents = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(
      file,
      `${ensureContentsEndsWithEmptyLine(fileContents)}\n${srcContents}`
    );
  } else {
    const { base, name, ext } = path.parse(src);
    const fileName = rename ? rename(name, ext.replace(".", "")) : base;
    const outputPath = path.join(dest, fileName);
    if (minify) {
      const srcContents = fs.readFileSync(src, "utf-8");
      const destContents = await terser.minify(srcContents, {
        sourceMap: true,
      });
      fs.createFileSync(outputPath);
      fs.writeFileSync(outputPath, destContents.code);
    } else {
      await fs.copy(src, outputPath);
    }
  }
}

/**
 * Renames a file with name and extension input.
 *  @typedef {(name:string, extension:string) => string} rename
 */

/**
 * copyFiles
 *
 * A rollup plugins that copys files.
 *
 * @param {Object} config - Config to copy files.
 * @param {string} config.src - The source files.
 * @param {string} config.dest - The destination folder.
 * @param {string} config.hook - The rollup output generation hook {@link https://rollupjs.org/plugin-development/#output-generation-hooks|Rollup Output Generation Hooks}.
 * @param {rename} config.rename - A function to rename output files.
 * @param {string} config.file - Name for single output file, when merging multiple source files into one.
 * @param {boolean} config.minify - Flag to minify output files.
 */
function copyFiles({
  src,
  dest = "dist/",
  hook = "generateBundle",
  rename,
  file,
  minify = false,
} = {}) {
  if (!src) throw new Error("src option missing");

  return {
    name: "copy-files",
    [hook]: async () => {
      const { globby } = await import("globby");
      const matchedPaths = await globby(src, {
        expandDirectories: false,
      });

      await Promise.all(
        matchedPaths.map((src) => copyContents(src, dest, rename, file, minify))
      );
    },
  };
}

export { copyFiles };
