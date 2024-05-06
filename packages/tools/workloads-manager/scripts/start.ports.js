const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const {
  findDirectoriesByName,
  executeScript,
  getArguments,
} = require("./utils");
const { checkPort, getLocalHosts } = require("./ports");

// workloads.config has a type property to determine which script to use to start the workload.
const startScripts = {
  static: "start:static",
};

/**
 * Starts all workloads from a workloads.config.json file.
 * It uses a different port for each workload, as assigned in the json file.
 */
async function start() {
  // We're starting from the root directory of the monorepo.
  const start = "../../../";
  // Name of the root directory - "aurora-workloads".
  const root = path.basename(path.resolve(start));

  const { data } = getArguments({ args: process.argv });

  if (!data) {
    throw Error("No data file passed in!");
  }

  const { workloads } = JSON.parse(fs.readFileSync(data, "utf-8"));

  const reports = [];
  const hosts = [...getLocalHosts()];

  // prevents warning: MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
  process.setMaxListeners(workloads.length);

  for (const workload of workloads) {
    const { port, name, type } = workload;

    if (!checkPort(port)) {
      // What should happen in this case?
      throw Error(`Port ${port} is not valid!`);
    }
    const results = await findDirectoriesByName({
      start,
      target: name,
      root,
    });
    const directory = results[0];

    executeScript({
      script: startScripts[type],
      directory,
      env: { PORT: port },
    });
    reports.push({ port, name, directory });
  }

  console.log("*********************************");
  console.log("The following apps have been attempted to start:");
  reports.forEach(({ port, name }) => {
    hosts.forEach((host) =>
      console.log(
        `🟢 ${chalk.green(name)} is available at: ${chalk.underline(
          chalk.blue(`http://${host}:${port}`)
        )}`
      )
    );
    console.log("*********************************");
  });
  console.log("Bye! 👋");
  console.log("*********************************");
}

start();
