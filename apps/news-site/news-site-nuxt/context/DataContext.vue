<script>
import { provide } from "vue";
import { content as contentEn } from "~/data/en/content";
import { content as contentJp } from "~/data/jp/content";
import { content as contentAr } from "~/data/ar/content";

import { settings as settingsEn } from "~/data/en/dialog";
import { settings as settingsJp } from "~/data/jp/dialog";
import { settings as settingsAr } from "~/data/ar/dialog";

import { footer as footerEn } from "~/data/en/footer";
import { footer as footerJp } from "~/data/jp/footer";
import { footer as footerAr } from "~/data/ar/footer";

import { sitemap as sitemapEn } from "~/data/en/sidebar";
import { sitemap as sitemapJp } from "~/data/jp/sidebar";
import { sitemap as sitemapAr } from "~/data/ar/sidebar";

import * as buttonsEn from "~/data/en/buttons";
import * as buttonsJp from "~/data/jp/buttons";
import * as buttonsAr from "~/data/ar/buttons";

import * as linksEn from "~/data/en/links";
import * as linksJp from "~/data/jp/links";
import * as linksAr from "~/data/ar/links";

import * as formsEn from "~/data/en/form";
import * as formsJp from "~/data/jp/form";
import * as formsAr from "~/data/ar/form";

const strings = {
    en: {
        content: contentEn,
        settings: settingsEn,
        footer: footerEn,
        sitemap: sitemapEn,
        buttons: buttonsEn,
        links: linksEn,
        forms: formsEn,
    },
    jp: {
        content: contentJp,
        settings: settingsJp,
        footer: footerJp,
        sitemap: sitemapJp,
        buttons: buttonsJp,
        links: linksJp,
        forms: formsJp,
    },
    ar: {
        content: contentAr,
        settings: settingsAr,
        footer: footerAr,
        sitemap: sitemapAr,
        buttons: buttonsAr,
        links: linksAr,
        forms: formsAr,
    },
};

export default {
    setup() {
        const defaultLanguage = "en";
        const urlParams = new URLSearchParams(window.location.search);
        const dir = urlParams.get("dir") ?? "ltr";
        const langFromUrl = urlParams.get("lang");
        const lang = langFromUrl && langFromUrl in strings ? langFromUrl : defaultLanguage;

        document.documentElement.setAttribute("dir", dir);
        document.documentElement.setAttribute("lang", lang);

        const value = {
            lang,
            dir,
            ...strings[lang],
        };

        provide("data", value);
    },
    render() {
        return this.$slots.default();
    },
};
</script>
