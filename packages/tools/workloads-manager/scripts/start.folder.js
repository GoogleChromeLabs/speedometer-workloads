const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const express = require("express");

const { findDirectoriesByName, getArguments } = require("./utils");
const { checkPort, getLocalHosts } = require("./ports");

/**
 * createApp
 *
 * Creates an express server, which serves workloads in a nested structure.
 *
 * Example:
 * localhost/news-site-next
 * localhost/news-site-nuxt
 *
 * @param {Object} config - Config object for function to run.
 * @param {Object} config.workloads - Workloads from workloads.config.json file.
 * @param {string} config.start - Start folder to use for discovering workloads folders.
 * @returns The main express app to use.
 */
async function createApp({ workloads, start }) {
  // Name of the root directory - "aurora-workloads".
  const root = path.basename(path.resolve(start));
  const app = express();

  for (const workload of workloads) {
    const { name, distDirectory = "/dist" } = workload;

    const results = await findDirectoriesByName({
      start,
      target: name,
      root,
    });

    const directory = results[0];
    app.use(`/${name}`, express.static(`${directory}${distDirectory}`));
  }

  return app;
}

/**
 * Starts all workloads from a workloads.config.json file.
 * It starts an express server, which serves all workloads in nested routes.
 */
async function start() {
  // We're starting from the root directory of the monorepo.
  const start = "../../../";

  const { data } = getArguments({ args: process.argv });

  if (!data) {
    throw Error("No data file passed in!");
  }

  const { workloads, ports } = JSON.parse(fs.readFileSync(data, "utf-8"));

  // prevents warning: MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
  process.setMaxListeners(ports.length);

  const apps = [];
  for (const port of ports) {
    if (!checkPort(port)) {
      // What should happen in this case?
      throw Error(`Port ${port} is not valid!`);
    }
    apps.push({ port, app: await createApp({ workloads, start }) });
  }

  const hosts = [...getLocalHosts()];
  console.log("hosts", hosts);
  console.log("*********************************");
  for (const { app, port } of apps) {
    app.listen(port, () => {
      workloads.forEach((workload) => {
        hosts.forEach((host) =>
          console.log(
            `🟢 [${port}]: ${chalk.green(
              workload.name
            )} is available at: ${chalk.underline(
              chalk.blue(`http://${host}:${port}/${workload.name}`)
            )}`
          )
        );
        console.log("*********************************");
      });
    });
  }
}

start();
