const path = require("path");
const { findDirectories, executeScript, getArguments } = require("./utils");
const { getPorts, getLocalHosts, checkPorts } = require("./ports");
const chalk = require("chalk");

// [TEMP]: Increase if we add more workloads
const defaultPorts = [
  3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013,
  3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026,
  3027, 3028, 3029, 3030, 3031,
];

/**
 * Start all workloads in the apps directory, by searching for package.json files in the apps directory.
 * Ports are assigned in different ways:
 *
 * Random ports - Selects a random port for each workload to start it with.
 * Default ports - Uses the ports from the defaultPorts array to start all workloads.
 * PORTS env - Uses the ports from the PORTS env that's passed in to start all workloads.
 *
 * Examples:
 * "start:all": "node scripts/start.all.js",
 * "start:all:ports": "PORTS='5001,5002' node scripts/start.all.js",
 * "start:all:default": "PORTS=default node scripts/start.all.js",
 */
async function start() {
  // We're looking for package.json files, to know what directory we should run the build script in.
  const target = "package.json";
  // We're starting from the root directory of the monorepo.
  const start = "../../../";
  // Name of the root directory - "aurora-workloads".
  const root = path.basename(path.resolve(start));
  const script = "start:static";

  const directories = await findDirectories({ start, target, root });

  const reports = [];
  const hosts = [...getLocalHosts()];

  let portsToUse;

  const { ports } = getArguments({ args: process.argv });
  if (ports) {
    if (ports === "default") {
      if (defaultPorts.length !== directories.length) {
        throw Error("Not enough default ports.");
      }
      portsToUse = [...defaultPorts];
    } else {
      const temp = ports.split(",");
      if (temp.length !== directories.length) {
        throw Error("Not enough ports passed in.");
      }

      portsToUse = temp.map((s) => {
        const port = Number(s);
        if (isNaN(port)) {
          throw Error("Not all ports a numbers.");
        }
        return port;
      });
    }

    const portsAreValid = await checkPorts({ ports: portsToUse });
    if (!portsAreValid) {
      throw Error("Not all ports are valid");
    }
  } else {
    portsToUse = await getPorts({ total: directories.length });
  }

  // prevents warning: MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
  process.setMaxListeners(directories.length);

  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i];
    const port = portsToUse[i];
    executeScript({ script, directory, env: { PORT: port } });
    reports.push({ port, name: path.basename(directory), directory });
  }

  console.log("*********************************");
  console.log("The following apps have been attempted to start:");
  reports.forEach(({ port, name }) => {
    hosts.forEach((host) =>
      console.log(
        `🟢 ${chalk.blue(name)} is available at: ${chalk.underline(
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
