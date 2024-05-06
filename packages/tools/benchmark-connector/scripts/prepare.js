const fs = require("fs").promises;
const { resolve } = require("path");

/**
 * deleteFile
 *
 * Deletes a file with a src input.
 *
 * @param {string} src Path to the file to delete.
 */
async function deleteFile(src) {
  try {
    await fs.unlink(src);
    console.log(`File ${src} has been deleted.`);
  } catch (err) {
    console.error("No previous file exists, no need to delete!");
  }
}

/**
 * copyAndUpdate
 *
 * Reads a source file and appends information from a meta file.
 * The new content gets copied to a destination folder.
 *
 * @param {Object} config - Config object for function to run.
 * @param {string} config.meta File that contains metadata, typically the package.json file.
 * @param {string} config.src Source file to copy.
 * @param {string} config.dest Destination of updated file.
 */
async function copyAndUpdate({ meta, src, dest }) {
  let contents = await fs.readFile(`${src}`, "utf8");

  if (meta) {
    const metaData = await fs.readFile(resolve(meta));
    const { name, version } = JSON.parse(metaData);
    contents = `window.name = "${name}"; window.version = "${version}"; ${contents}`;
  }

  await fs.writeFile(`${dest}`, contents);
}

/**
 * prepare
 *
 * Function that copies the benchmark-connector.min file with new metadata to a new location.
 * An optional 'HOST' environment variable can be used to assign a custom host directory.
 *
 */
async function prepare() {
  const hostDirectory = process.env.HOST ?? "public";
  await deleteFile(`${hostDirectory}/benchmark-connector.min.js`);
  await copyAndUpdate({
    meta: "./package.json",
    src: "node_modules/benchmark-connector/dist/benchmark-connector.min.js",
    dest: `${hostDirectory}/benchmark-connector.min.js`,
  });
  console.log("Done with preparation!");
}

prepare();
