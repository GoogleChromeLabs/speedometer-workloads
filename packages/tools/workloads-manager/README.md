# workloads-manager

A collection of scripts to manage workloads for a benchmark.

## build

The [build:apps script](./scripts/build.js) looks for all workloads directories, by searching for `package.json` files and attempts to run its `build:static` script.
The `TYPE` environment variable determines which build script to run on all workloads. Currently, only static builds are supported.

## connect

The [connect script](./scripts/connect.js) checks and waits for connectivity of ports, which are passed in via a `DATA` environment variable.

## start:all

The [start:all script](./scripts/start.all.js) looks for all workloads directories, by searching for `package.json` fiels and attempmts to run the `start:static` script.
It uses either random open ports, default ports, or ports passed along to the script.

## start:domain

The [start:domain script](./scripts/start.domain.js) uses a `workloads.config.json` file and starts all workloads on a subdomain.

## start:folder

The [start:folder script](./scripts/start.folder.js) uses a `workloads.config.json` file and starts a node server, serving all workloads in sub-directories (according to their package name).

## start:ports

The [starts:ports script](./scripts/start.ports.js) uses a `workloads.config.json` file and serves each workload on the port specified in the json file.
