# benchmark-connector

The benchmark-connector enables communication between the benchmark and a workload via the `post-message` api.
Each workload that wants to opt in needs the `benchmark-connector.min.js` file added to its html pages.

A `prepare` file is available, that can copy the benchmark-connector.min.js file from the node-modules folder to the appropriate directory of the workload. This is typically the `public`, `dist` or the `root` folder and is customizable through the `HOST` environment variable of the npm script. During the prepare process, two global variables get set and added to the benchmark-connector.min file:

-   window.name: Package name of the workload.
-   window.version: Package version of the workload.

Both variables are used to create an `appId`, which will get sent with each postMessage event.

An initial `app-ready` message is broadcasted after the benchmark-connector's initialization:

```JavaScript
window.top.postMessage({ type: "app-ready", status: "success", appId }, "*");
```
