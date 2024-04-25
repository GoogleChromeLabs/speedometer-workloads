const fs = require("fs-extra");
const net = require("net");
const { getLocalHosts } = require("./ports");
const { showLoadingAnimation } = require("./loader");
const { getArguments } = require("./utils");

const connectionTimeout = 300;
const retryTimeout = 500;
const maxTimeout = 10000;

/**
 * checkConnection
 *
 * Takes a host and port to check if a connection exists.
 * This is done, by using net.connect and listening for the 'connect' or 'error' event.
 *
 * @param {Object} config - Config object for function to run.
 * @param {string} config.host - Host to use.
 * @param {string} config.port - Port to use.
 * @return {Promise<Boolean>} Wheter a connection was detected or not.
 */
function checkConnection({ host, port }) {
  return new Promise((resolve) => {
    const connection = net.connect(port, host);
    connection.on("error", function () {
      resolve(false);
    });
    connection.on("timeout", function () {
      connection.end();
      resolve(false);
    });
    connection.on("connect", function () {
      connection.end();
      console.log(`\nConnection detected on port ${port}!\n`);
      resolve(true);
    });
    connection.setTimeout(connectionTimeout);
  });
}

/**
 * waitForConnection
 *
 * Keeps waiting for a connection to get established.
 * Since this long-polling solution never times out, 'waitForConnectionWithTimeout' should be preferred.
 *
 * @param {Object} config - Config object for function to run.
 * @param {string} config.host - Host to use.
 * @param {string} config.port - Port to use.
 * @return {Promise<Boolean>} Wheter a connection was detected or not.
 */
async function waitForConnection({ host, port }) {
  if (await checkConnection({ host, port })) {
    return true;
  }

  await new Promise((resolve) => setTimeout(resolve, retryTimeout));
  return waitForConnection({ host, port });
}

/**
 * waitForConnectionWithTimeout
 *
 * Keeps waiting for a connection to get established, until it times out.
 *
 * @param {Object} config - Config object for function to run.
 * @param {string} config.host - Host to use.
 * @param {string} config.port - Port to use.
 * @return {Promise<Boolean>} Wheter a connection was detected or not.
 */
async function waitForConnectionWithTimeout({ host, port }) {
  const timeoutRef = setTimeout(function () {
    process.once("exit", () =>
      console.error(`Connection on port ${port} failed!`)
    );
    process.exit(0);
  }, maxTimeout);

  const response = await waitForConnection({ host, port });
  clearTimeout(timeoutRef);
  return response;
}

/**
 * connect
 *
 * Function that waits for all ports to be connected.
 * It expects a workloads.config.json file to be passed in as a 'DATA' env.
 */
async function connect() {
  const { data } = getArguments({ args: process.argv });

  if (!data) {
    throw Error("No data file passed in!");
  }

  const { ports } = JSON.parse(fs.readFileSync(data, "utf-8"));

  const hosts = [...getLocalHosts()];
  // just using one local host value for now
  const host = hosts[0];

  const loadingRef = showLoadingAnimation({
    text: "Waiting for connection.",
  });

  await Promise.all(
    ports.map((port) => waitForConnectionWithTimeout({ port, host }))
  );

  clearInterval(loadingRef);
  console.log("All ports are connected!");
}

connect();
