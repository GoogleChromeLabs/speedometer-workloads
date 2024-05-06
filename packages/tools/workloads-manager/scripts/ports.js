const net = require("node:net");
const os = require("node:os");

/**
 * getPort
 *
 * Returns an open port if available. If no port value was passed to the function, a random open port is used.
 * If a port number was passed in, it will check if it's open.
 *
 * @param {Object} config - Config object for function to run.
 * @param {number} config.port - Port number to use.
 * @param {string} config.host - Host to use for port.
 * @return {Promise<Boolean>} Wheter a port is open or not.
 */
function getPort(options = { port: 0, host: "localhost" }) {
  return new Promise(function (resolve, reject) {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);

    server.listen(options, function () {
      const { port } = server.address();
      server.close(function () {
        resolve(port);
      });
    });
  });
}

/**
 * getPorts
 *
 * Returns an array of one or more open ports.
 *
 * @param {Object} config - Config object for function to run.
 * @param {number} config.total - Total number of ports to return.
 * @returns {number[]} Returns an array of open ports.
 */
async function getPorts({ total = 1 }) {
  const ports = [];
  for (let i = 0; i < total; i++) {
    const port = await getPort();
    ports.push(port);
  }
  return ports;
}

/**
 * checkPort
 *
 * Takes a port and checks if it is open or not.
 *
 * @param {Object} config - Config object for function to run.
 * @param {number} config.port - Port to check.
 * @return {Promise<Boolean>} Wheter port is open or not.
 */
async function checkPort({ port }) {
  try {
    await getPort({ port });
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * checkPorts
 *
 * Takes an array of ports and check if they are all open.
 *
 * @param {Object} config - Config object for function to run.
 * @param {number[]} config.ports - Array of ports to check.
 * @return {Promise<Boolean>} Wheter all ports are open or not.
 */
async function checkPorts({ ports }) {
  for (const port of ports) {
    try {
      await getPort({ port });
    } catch (e) {
      return false;
    }
  }

  return true;
}

/**
 * getLocalHosts
 *
 * Returns all local hosts available.
 *
 * @returns {string[]} Array with all local hosts.
 */
function getLocalHosts() {
  const interfaces = os.networkInterfaces();

  const results = new Set();

  for (const _interface of Object.values(interfaces)) {
    for (const config of _interface) {
      // temp: only IPv4 and local hosts
      if (config.family === "IPv4" && config.internal)
        results.add(config.address);
    }
  }

  return results;
}

module.exports = {
  checkPort,
  checkPorts,
  getPort,
  getPorts,
  getLocalHosts,
};
