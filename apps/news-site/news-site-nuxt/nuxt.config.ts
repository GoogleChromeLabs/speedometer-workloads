// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import path from "path";

const target = process.env.TARGET ?? "node";

let nuxtConfig = {};

const headConfig = {
    title: "The Daily Broadcast",
    htmlAttrs: {
        lang: "en",
    },
    meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
            hid: "description",
            name: "description",
            content: "A news site developed with Nuxt.",
        },
    ],
    script: [
        { src: "./benchmark-connector.min.js" },
    ]
};

const baseConfig = {
    ssr: false,
    css: ["news-site-css/dist/variables.css", "news-site-css/dist/global.css", "news-site-css/dist/a11y.css", "news-site-css/dist/icons.css", "news-site-css/dist/text.css"],
    components: ["~/components", "~/components/assets", "~/components/atoms", "~/components/molecules", "~/components/organisms"],
    router: {
        options: {
            hashMode: true,
        },
    },
    app: {
        head: { ...headConfig }
    },
    $production: {
        sourcemap: true
    }
};

const staticConfig = {
    ssr: false,
    nitro: {
        prerender: {
            crawlLinks: false,
        },
        output: {
            publicDir: path.join(__dirname, "dist"),
        },
    },
    app: {
        head: { ...headConfig },
        cdnURL: "./",
        baseURL: "./",
    },
};

const dynamicConfig = {
    nitro: {
        output: {
            publicDir: path.join(__dirname, "output"),
        },
    },
};

switch (target) {
    case "static":
        nuxtConfig = { ...baseConfig, ...staticConfig };
        break;
    default:
        nuxtConfig = { ...baseConfig, ...dynamicConfig };
}

export default defineNuxtConfig(nuxtConfig);
