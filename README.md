# Speedometer Workloads

Speedometer Workloads is a collection of open source example apps and sites that aim to be representative of the web. These workloads can be consumed by benchmarks for testing and benchmarking purposes.
This repo contains two distinct directories, which groups containing projects into `apps` and `packages`.

-   `apps`: Main directory for workload apps and websites.
-   `packages`: Reusable projects that can be consumed by workloads or benchmarks.

 **Table of content:**

 - [Development](#development)
    - [How to run a workload](#how-to-run-a-workload)
    - [How to run default workloads](#how-to-run-default-workloads)
    - [Available workload scripts](#available-workload-scripts)
    - [Workload-Benchmark communication](#workload-benchmark-communication)
    - [How to build all workloads](#how-to-build-all-workloads)
 - [Workloads](#workloads)
    - [Charts](#charts)
    - [Complex Dom](#complex-dom)
    - [Dashboards](#dashboards)
    - [Editors](#editors)
    - [News Site](#news-site)
    - [TodoMVC](#todomvc)
 - [Packages](#packages)
    - [Plugins](#plugins)
      - [Rollup Constructable CSS](#rollup-constructable-css)
      - [Rollup Copy Files](#rollup-copy-files)
    - [Styles](#styles)
      - [News Site CSS](#news-site-css)
      - [TodoMVC CSS](#todomvc-css)
    - [Tools](#tools)
      - [Benchmark Connector](#benchmark-connector)
      - [Workloads Manager](#workloads-manager)

## Development

This monorepo is managed by [pnpm](https://pnpm.io/). In order to develop or test locally, please ensure that pnpm is installed on your machine.

Install pnpm globally with npm:

```bash
npm install -g pnpm
```

For troubleshooting, refer to this [guide](https://pnpm.io/installation).

Once pnpm is available, the following script installs all dependencies for all projects:

```bash
pnpm install
```

### How to run a workload

To run a single app, a filter function from pnpm can be used from the root directory. Each app can be targeted by referencing its package name.
For example to run the `news-site-next` app in development mode, the following command can be used:

```bash
pnpm -F news-site-next dev
```

### How to run default workloads

See [Workloads Manager](#workloads-manager).

```bash
pnpm -F workloads-manager start
```

### Available Workload scripts

The following scripts are currently supported by all workloads:

- `dev`: Run a workload in dev mode locally.
- `build:static`: Bundles all necessary files and copies them into a `dist` folder.
- `start:static`: Starts a node server to serve files from the `dist` folder.

These scripts can be used either by opening a terminal in each workloads directory itself, or from the root of this repo.

From a workloads directory, by navigating to the folder in your finder and opening a terminal.

Example `news-site-next`:

```bash
npm run dev
npm run build:static
npm run start:static
```

From the root of the repo with pnpm and a filter flag.

Example `news-site-next`:

```bash
pnpm -F news-site-next dev
pnpm -F news-site-next build:static
pnpm -F news-site-next start:static
```

### Workload-Benchmark communication

To enable communication between the workloads and a benchmark using postMessage, the [benchmark-connector](#benchmark-connector) package is used.
Each workload that opts into this feature has the benchmark-connector package installed.
Some workloads use a `prepare` script to copy the relevant JavaScript file to the appropriate directory.

### How to build all workloads

To run the build script on all apps, the following command can be used:

```bash
pnpm run build:apps
```

## Workloads

Main directory for all workloads, which are grouped by categories:

- `charts`: Various charting apps.
- `complex-dom`: TodoMvc apps wrapped in a complex dom.
- `editors`: Various editing apps.
- `news-site`: Various versions of a news site.
- `todomvc`: Various versions of a todo application.

### Charts

Charting apps allow us to test SVG and canvas rendering by displaying charts in various workloads. 
These apps represent popular sites that display financial information, stock charts or dashboards. 

Observable Plot displays a stacked bar chart, as well as a dotted chart. It is based on D3, which is a JavaScript library for visualizing tabular data and outputs SVG elements. It loops through a big dataset to build the source data that D3 needs, using map, filter and flatMap methods. As a result this exercises creation and copying of objects and arrays.

Chart.js is a JavaScript charting library. The included workload displays a scatter graph with the canvas api, both with some transparency and with full opacity. This uses the same data as the previous workload, but with a different preparation phase. In this case it makes a heavy use of trigonometry to compute distances between airports.

React Stockcharts displays a dashboard for stocks. It is based on D3 for all computation, but outputs SVG directly using React.

#### charts-chartjs

```bash
pnpm -F charts-chartjs dev
pnpm -F charts-chartjs build:static
pnpm -F charts-chartjs start:static
```

#### charts-observable-plot

```bash
pnpm -F charts-observable-plot dev
pnpm -F charts-observable-plot build:static
pnpm -F charts-observable-plot start:static
```

#### charts-react-stockcharts

```bash
pnpm -F charts-react-stockcharts dev
pnpm -F charts-react-stockcharts build:static
pnpm -F charts-react-stockcharts start:static
```

### Complex DOM

The complex DOM workloads embed various TodoMVC implementations in a static UI shell that mimics a complex web page. The idea is to capture the performance impact on executing seemingly isolated actions (e.g. adding/deleting todo items) in the context of a complex website.

#### todomvc-angular-complex

```bash
pnpm -F todomvc-angular-complex dev
pnpm -F todomvc-angular-complex build:static
pnpm -F todomvc-angular-complex start:static
```

#### todomvc-backbone-complex

```bash
pnpm -F todomvc-backbone-complex dev
pnpm -F todomvc-backbone-complex build:static
pnpm -F todomvc-backbone-complex start:static
```

#### todomvc-es5-complex

```bash
pnpm -F todomvc-es5-complex dev
pnpm -F todomvc-es5-complex build:static
pnpm -F todomvc-es5-complex start:static
```

#### todomvc-es6-webpack-complex

```bash
pnpm -F todomvc-es6-webpack-complex dev
pnpm -F todomvc-es6-webpack-complex build:static
pnpm -F todomvc-es6-webpack-complex start:static
```

#### todomvc-jquery-complex

```bash
pnpm -F todomvc-jquery-complex dev
pnpm -F todomvc-jquery-complex build:static
pnpm -F todomvc-jquery-complex start:static
```

#### todomvc-lit-complex

```bash
pnpm -F todomvc-lit-complex dev
pnpm -F todomvc-lit-complex build:static
pnpm -F todomvc-lit-complex start:static
```

#### todomvc-preact-complex

```bash
pnpm -F todomvc-preact-complex dev
pnpm -F todomvc-preact-complex build:static
pnpm -F todomvc-preact-complex start:static
```

#### todomvc-react-complex

```bash
pnpm -F todomvc-react-complex dev
pnpm -F todomvc-react-complex build:static
pnpm -F todomvc-react-complex start:static
```

#### todomvc-react-redux-complex

```bash
pnpm -F todomvc-react-redux-complex dev
pnpm -F todomvc-react-redux-complex build:static
pnpm -F todomvc-react-redux-complex start:static
```

#### todomvc-svelte-complex

```bash
pnpm -F todomvc-svelte-complex dev
pnpm -F todomvc-svelte-complex build:static
pnpm -F todomvc-svelte-complex start:static
```

#### todomvc-vue-complex

```bash
pnpm -F todomvc-vue-complex dev
pnpm -F todomvc-vue-complex build:static
pnpm -F todomvc-vue-complex start:static
```

#### todomvc-web-components-complex

```bash
pnpm -F todomvc-web-components-complex dev
pnpm -F todomvc-web-components-complex build:static
pnpm -F todomvc-web-components-complex start:static
```

### Dashboards

#### perf.webkit.org

Webkit Perf-Dashboard is an application used to track various performance metrics of WebKit. The dashboard uses canvas drawing and web components for its ui.

### Editors

Editors, for example WYSIWYG text and code editors, let us focus on editing live text and capturing form interactions. Typical scenarios are writing an email, logging into a website or filling out an online form.

Codemirror is a code editor that implements a text input field with support for many editing features. Several languages and frameworks are available and for this workload we used the JavaScript library from Codemirror.

Tiptap Editor is a headless, framework-agnostic rich text editor that's customizable and extendable. This workload used Tiptap as its basis and added a simple ui to interact with. 

#### editors-codemirror

```bash
pnpm -F editors-codemirror dev
pnpm -F editors-codemirror build:static
pnpm -F editors-codemirror start:static
```

#### editors-tiptap

```bash
pnpm -F editors-tiptap dev
pnpm -F editors-tiptap build:static
pnpm -F editors-tiptap start:static
```

### News Site

A news site that allows testing of a single-page application. The content is derrived from a static local source and is available in english, japanese and arabic.
Styling supports left-to-right (LTR) and right-to-left (RTL) and can be forced by passing in the following url parameters:

- `dir`: "rtl" or "ltr"
- `lang`: "en", "jp" or "ar" (defaults to "en" if language is not found)

Several interactions are available, such as:

- navigating to different pages
- expanding and collapsing a sitebar
- showing and hiding of login modal
- showing and hiding of settings modal
- toggling of drop-down menu

#### news-site-next

```bash
pnpm -F news-site-next dev
pnpm -F news-site-next build
pnpm -F news-site-next build:static
pnpm -F news-site-next start
pnpm -F news-site-next start:static
```

#### news-site-nuxt

```bash
pnpm -F news-site-nuxt dev
pnpm -F news-site-nuxt build
pnpm -F news-site-nuxt build:static
pnpm -F news-site-nuxt start
pnpm -F news-site-next start:static
```

### TodoMVC

TodoMVC is a to-do application that allows a user to keep track of tasks. The user can enter a new task, update an existing one, mark a task as completed, or delete it. In addition to the basic CRUD operations, the TodoMVC app has some added functionality: filters are available to change the view to “all”, “active” or “completed” tasks and a status text displays the number of active tasks to complete.

#### todomvc-angular

```bash
pnpm -F todomvc-angular dev
pnpm -F todomvc-angular build:static
pnpm -F todomvc-angular start:static
```

#### todomvc-backbone

```bash
pnpm -F todomvc-backbone dev
pnpm -F todomvc-backbone build:static
pnpm -F todomvc-backbone start:static
```

#### todomvc-es5

```bash
pnpm -F todomvc-es5 dev
pnpm -F todomvc-es5 build:static
pnpm -F todomvc-es5 start:static
```

#### todomvc-es6-webpack

```bash
pnpm -F todomvc-es6-webpack dev
pnpm -F todomvc-es6-webpack build:static
pnpm -F todomvc-es6-webpack start:static
```

#### todomvc-jquery

```bash
pnpm -F todomvc-jquery dev
pnpm -F todomvc-jquery build:static
pnpm -F todomvc-jquery start:static
```

#### todomvc-lit

```bash
pnpm -F todomvc-lit dev
pnpm -F todomvc-lit build:static
pnpm -F todomvc-lit start:static
```

#### todomvc-preact

```bash
pnpm -F todomvc-preact dev
pnpm -F todomvc-preact build:static
pnpm -F todomvc-preact start:static
```

#### todomvc-react

```bash
pnpm -F todomvc-react dev
pnpm -F todomvc-react build:static
pnpm -F todomvc-react start:static
```

#### todomvc-react-redux

```bash
pnpm -F todomvc-react-redux dev
pnpm -F todomvc-react-redux build:static
pnpm -F todomvc-react-redux start:static
```

#### todomvc-svelte

```bash
pnpm -F todomvc-svelte dev
pnpm -F todomvc-svelte build:static
pnpm -F todomvc-svelte start:static
```

#### todomvc-vue

```bash
pnpm -F todomvc-vue dev
pnpm -F todomvc-vue build:static
pnpm -F todomvc-vue start:static
```

#### todomvc-web-components

```bash
pnpm -F todomvc-web-components dev
pnpm -F todomvc-web-components build:static
pnpm -F todomvc-web-components start:static
```

## Packages

Directory that contains shareable utilities that can be consumed by the apps, or installed by a benchmark. 

To format all packages or to build all packages, the following script can be used:

```bash
pnpm run format:packages
pnpm run build:packages
```

### Plugins

Various plugins for bundlers.

#### rollup-constructable-css

```bash
pnpm -F rollup-constructable-css format
pnpm -F rollup-constructable-css build
```

#### rollup-copy-files

```bash
pnpm -F rollup-copy-files format
pnpm -F rollup-copy-files build
```

### Styles

Styles for workloads.

#### news-site-css

```bash
pnpm -F news-site-css format
pnpm -F news-site-css build
```

#### todomvc-css

```bash
pnpm -F todomvc-css format
pnpm -F todomvc-css build
```

### Tools

Tools that are used by workloads or benchmarks.

#### app-build-scripts

A script that helps moving workload files to an output folder. This script also takes care or renaming references in the index.html file, to ensure the output folder contains a locally contained build.

```bash
pnpm -F app-build-scripts format
pnpm -F app-build-scripts build
```

#### benchmark-connector

Enables communication between benchmarks and workloads.

-   benchmark-connector.min.js: communication between benchmark and workload.
-   prepare.min.js: script to copy benchmark-connector.min.js file to the public folder of workload.

```bash
pnpm -F benchmark-connector format
pnpm -F benchmark-connector build
```

#### big-dom-generator

Used to generate a complex dom for todomvc apps.

```bash
pnpm -F big-dom-generator build
```

#### sanitize-language

Utility to remove words from output files that should be ommited.

```bash
pnpm -F sanitize-language format
pnpm -F sanitize-language build
```

#### workloads-manager

Manages all workloads, by using the following commands:

-   connect: waits for a connection on all ports from the workloads.config.json file.
-   start: starts node server for static workloads from the workloads.config.json file.

```bash
pnpm -F workloads-manager format
pnpm -F workloads-manager build
pnpm -F workloads-manager connect
pnpm -F workloads-manager start
```

The workloads manager depends on a `workloads.config.json` file, which contains a list of apps to run.

- The `ports` key is a list of ports to start a server on.
- The `workloads` key contains an array of workloads.

Each workload contains the following keys:
- `name`: Package name of the workload.
- `type`: Build type, to determine how to run it Currently only `static` is supported.

```json
{
    "ports": [8080, 8081]
    "workloads": [
        { 
            "name": "news-site-next",
            "type": "static",
            
        }
    ]
}
```
