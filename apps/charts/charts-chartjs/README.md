# Charts - Chartjs

## How to run locally

This project uses `npm` to manage dependencies and run scripts. It has been
tested with node v18 but should work with other versions of node.

This uses [vite](https://vitejs.dev/) as builder but this should be fairly
transparent.

### Install dependencies

```
npm i
```

### Run the development server

```
npm run dev
```

### Build the app

```
npm run build:static
```

### Preview the production build

```
npm run start:static
```

### [ChartJS](https://github.com/chartjs/Chart.js)

You can load this benchmark with the `/chartjs.html` page, for example
http://localhost:5173/chartjs.html if you run it locally or
http://localhost:7000/resources/charts/dist/chartjs.html in the
context of speedometer.

ChartJS is canvas-based.

When run in development mode, the page will automatically execute the scatter
graph.

In production mode nothing executes by default, the user needs to push the
buttons to run any code. That's how the benchmark exercizes this code.

To build these graphs, we use datasets representing flight information in the
US. You can consult them in the [datasets directory](./datasets).
