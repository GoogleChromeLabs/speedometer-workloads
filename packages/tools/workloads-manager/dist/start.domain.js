const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const express = require("express");
var vhost = require("vhost");

const { findDirectoriesByName } = require("./utils");
const { checkPort } = require("./ports");

/**
 * createApp
 * 
 * Creates an express server, which serves subdomains for each workload.
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
    const { name, domain } = workload;
    const host = domain.replace("*", name);

    const results = await findDirectoriesByName({
      start,
      target: name,
      root,
    });

    const directory = results[0];
    const webapp = express();
    webapp.use("/", express.static(`${directory}/dist`));
    app.use(vhost(host, webapp));
  }

  return app;
}

/**
 * Starts all workloads from a workloads.config.json file.
 * It creates subdomains for each workloads and starts an express server.
 * 
 * For subdomain to work locally, the ect/hosts file needs to contain the subdomains:
 * 
 * 127.0.0.1   workloads.com
 * 
 * 127.0.0.1   charts-chartjs.workloads.com
 * 127.0.0.1   charts-observable-plot.workloads.com
 * 
 * 127.0.0.1   editors-codemirror.workloads.com
 * 127.0.0.1   editors-tiptap.workloads.com
 * 
 * 127.0.0.1   news-site-next.workloads.com
 * 127.0.0.1   news-site-nuxt.workloads.com
 * 
 * 127.0.0.1   todomvc-angular.workloads.com
 * 127.0.0.1   todomvc-backbone.workloads.com
 * 127.0.0.1   todomvc-es5.workloads.com
 * 127.0.0.1   todomvc-es6-webpack.workloads.com
 * 127.0.0.1   todomvc-jquery.workloads.com
 * 127.0.0.1   todomvc-lit.workloads.com
 * 127.0.0.1   todomvc-preact.workloads.com
 * 127.0.0.1   todomvc-react.workloads.com
 * 127.0.0.1   todomvc-react-redux.workloads.com
 * 127.0.0.1   todomvc-svelte.workloads.com
 * 127.0.0.1   todomvc-vue.workloads.com
 * 127.0.0.1   todomvc-web-components.workloads.com
 * 
 * 127.0.0.1   todomvc-angular-complex.workloads.com
 * 127.0.0.1   todomvc-backbone-complex.workloads.com
 * 127.0.0.1   todomvc-es5-complex.workloads.com
 * 127.0.0.1   todomvc-es6-webpack-complex.workloads.com
 * 127.0.0.1   todomvc-jquery-complex.workloads.com
 * 127.0.0.1   todomvc-lit-complex.workloads.com
 * 127.0.0.1   todomvc-preact-complex.workloads.com
 * 127.0.0.1   todomvc-react-complex.workloads.com
 * 127.0.0.1   todomvc-react-redux-complex.workloads.com
 * 127.0.0.1   todomvc-svelte-complex.workloads.com
 * 127.0.0.1   todomvc-vue-complex.workloads.com
 * 127.0.0.1   todomvc-web-components-complex.workloads.com
 */
async function start() {
  // We're starting from the root directory of the monorepo.
  const start = "../../../";

  if (!process.env.DATA) {
    throw Error("No data file passed in!");
  }

  const { workloads, ports } = JSON.parse(
    fs.readFileSync(process.env.DATA, "utf-8")
  );

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

  console.log("*********************************");
  for (const { app, port } of apps) {
    app.listen(port, () => {
      workloads.forEach((workload) => {
        const { domain, name } = workload;
        const host = domain.replace("*", name);
        console.log(
          `🟢 ${chalk.green(workload.name)} is available at: ${chalk.underline(
            chalk.blue(`http://${host}:${port}`)
          )}`
        );
        console.log("*********************************");
      });
    });
  }
}

start();
