/** @type {import('next').NextConfig} */
const target = process.env.TARGET ?? "node";
let nextConfig = {};

const baseConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
};

const staticConfig = {
    output: "export",
    distDir: "dist",
    assetPrefix: "./",
    images: {
        unoptimized: true,
    },
    env: {
        TARGET: "static"
    }
};

const staticWithBaseConfig = {
    output: "export",
    distDir: "dist-base",
    assetPrefix: "./",
    images: {
        unoptimized: true,
    },
    env: {
        TARGET: "static"
    },
    basePath: process.env.BASE
};

const dynamicConfig = {
    distDir: "output",
};

const dynamicWithBaseConfig = {
    distDir: "output-base",
    basePath: process.env.BASE
};

switch (target) {
    case "static":
        nextConfig = { ...baseConfig, ...staticConfig };
        break;
    case "static-base":
        nextConfig = { ...baseConfig, ...staticWithBaseConfig };
        break;
    case "dynamic-base":
        nextConfig = { ...baseConfig, ...dynamicWithBaseConfig };
        break;
    default:
        nextConfig = { ...baseConfig, ...dynamicConfig };
}

module.exports = nextConfig;
