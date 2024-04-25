const fs = require("fs-extra");
const path = require("path");

const {
  findDirectoriesByName,
  getHomeDirectory,
  getArguments,
} = require("./utils");

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
 * moveWorkload
 *
 * Copies dist files of a workload to an output folder.
 *
 * @param {Object} config - Config object for function to run.
 * @param {Object} config.workloads - Workloads from workloads.config.json file.
 * @param {string} config.start - Start folder to use for discovering workloads folders.
 * @param {string} config.output - Output folder to use.
 */
async function moveWorkload({ workload, start, output }) {
  // Name of the root directory - "aurora-workloads".
  const root = path.basename(path.resolve(start));

  const { name, distDirectory = "/dist" } = workload;

  const results = await findDirectoriesByName({
    start,
    target: name,
    root,
  });

  const directory = results[0];

  const src = `${directory}${distDirectory}`;
  const dest = `${output}/${name}`;

  await createDirectory(dest);
  await copyDirectory(src, dest);
}

async function moveWorkloads() {
  const { data, output } = getArguments({ args: process.argv });

  if (!data) {
    throw Error("No data file passed in!");
  }

  // We're starting from the root directory of the monorepo.
  const start = "../../../";

  /**
   * Location of the output folder, where all workloads get moved to.
   * If an OUTPUT was passed in that's located inside the aurora-workloads repo, please ensure that the OUTPUT gets added to the exclude list, when searching for directories:
   * ./utils.js / excludeList
   *
   * IF no OUTPUT was passed in, the default location is a folder called '.workloads' in the root of the repository ('aurora-workloads/.workloads').
   */
  let outputName = output ?? `${start}.workloads`;

  if (outputName.charAt(0) === "~") {
    outputName = outputName.replace("~", getHomeDirectory());
  }

  // Ensure node can find the output path.
  const outputPath = path.resolve(outputName);

  await createDirectory(outputPath);

  const { workloads } = JSON.parse(fs.readFileSync(data, "utf-8"));

  for (const workload of workloads) {
    await moveWorkload({ workload, start, output: outputPath });
  }

  console.log("Done!");
}

moveWorkloads();
