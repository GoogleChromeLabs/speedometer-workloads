# workloads-manager

A collection of scripts to manage workloads for a benchmark.

## build

The [build:apps script](./scripts/build.js) looks for all workloads directories, by searching for `package.json` files and attempts to run its `build:static` script.
The `TYPE` environment variable determines which build script to run on all workloads. Currently, only static builds are supported.

## move

The [move script](./scripts/move.js) copies all `dist` folders of all workloads to a new directory. The default directory is called `.workloads` in the root of the monorepo.
The [workloads.config.folder.json](./workloads.config.folder.json) is used to determine which apps to copy over.
