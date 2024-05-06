# news-site-css

This package allows you to use the stylesheets in various ways, either by including the complete rules (index.css, index.min.css) in a link tag, or by importing partial css / css module files in your code.

## How to install

Install the package manually, by adding an entry to your package.json file and running `pnpm install`.

```bash
"dependencies": {
    "news-site-css": "workspace:*"
}
```

## How to use

including the styles in html with a link tag

```html
<link href="news-site-css/dist/index.min.css" rel="stylesheet" />
```

importing the styles in JavaScript:

```javascript
import "news-site-css/dist/global.css";
```

importing a css module in React:

```javascript
import styles from "news-site-css/dist/footer.module.css";

export default function Footer() {
    return <footer className={styles.footer}></footer>;
}
```

constructable stylesheets:

```javascript
import sheet from "news-site-css/dist/footer.constructable.js";

document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
```

constructable stylesheets in shadow DOM:

```javascript
import sheet from "news-site-css/dist/footer.constructable.js";

const node = document.createElement("div");
const shadow = node.attachShadow({ mode: "open" });
shadow.adoptedStyleSheets = [sheet];
```
