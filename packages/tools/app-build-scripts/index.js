const fs = require("fs").promises;
const { dirname } = require("path");

/**
 * createDirectory
 *
 * Removes and recreates a directory.
 *
 * @param {string} directory Directory name.
 */
async function createDirectory(directory) {
  await fs.rm(directory, { recursive: true, force: true });
  await fs.mkdir(directory);
}

/**
 * copyDirectory
 *
 * Copies a source folder to a destination folder.
 *
 * @param {string} src Source directory.
 * @param {string} dest Destination directory.
 */
async function copyDirectory(src, dest) {
  await fs.cp(src, dest, { recursive: true }, (err) => {
    if (err) console.error(err);
  });
}

/**
 * copyFile
 *
 * Copies a file from a source to a destination.
 *
 * @param {string} src Source file.
 * @param {string} dest Destination file.
 */
async function copyFile(src, dest) {
  await fs.mkdir(dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

/**
 * copyFiles
 *
 * Copies multiple files from a source to a destination.
 *
 * @param {string[]} files Array of files to copy.
 */
async function copyFiles(files) {
  for (const file of files) await copyFile(file.src, `${file.dest}`);
}

/**
 * updateImportsInFile
 *
 * Reads a file and replaces a source path with a destination path.
 *
 * @param {Object} config - Config to update imports
 * @param {string} config.src - The source path.
 * @param {string} config.dest - The destination path.
 * @param {string} config.file - File to read from.
 */
async function updateImportsInFile({ file, src, dest }) {
  let contents = await fs.readFile(`${file}`, "utf8");
  contents = contents.replaceAll(src, dest);
  await fs.writeFile(`${file}`, contents);
}

/**
 * updateImports
 *
 * Updates imports in multiple files.
 *
 * @param {Object} config - Config to update imports
 * @param {string} config.src - The source path.
 * @param {string} config.dest - The destination path.
 * @param {string} config.file - Files to read from.
 */
async function updateImports({ files, src, dest }) {
  for (const file of files) {
    await updateImportsInFile({ file, src, dest });
  }
}

module.exports = {
  createDirectory,
  copyDirectory,
  copyFile,
  copyFiles,
  updateImports,
  updateImportsInFile,
};
