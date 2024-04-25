const sheet = new CSSStyleSheet();
sheet.replaceSync(`.icons-group {
    display: flex;
}

.icons-group .icons-group-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.icons-group .icons-group-item {
    position: relative;
}

.icons-group .icons-group-item:not(:last-child) {
    margin-inline-end: var(--content-spacing-large);
}

.icons-group .icons-group-item button {
    cursor: pointer;
    display: flex;
    border-width: 0;
}

.group-icon {
    display: flex;
    position: relative;
}

.group-icon-small {
    width: var(--icon-size-small);
    height: var(--icon-size-small);
}

.group-icon-medium {
    width: var(--icon-size);
    height: var(--icon-size);
}

.group-icon svg path {
    fill: var(--theme-icon-fill-light);
    transition: fill 0.3s ease;
}

.icons-group li:hover .group-icon svg path {
    fill: var(--theme-icon-fill-lighter);
}

@media (forced-colors: active) {
    .group-icon svg path {
        fill: var(--high-contrast-icon-fill-light, var(--color-system-linktext));
    }

    .icons-group li:hover .group-icon svg path {
        fill: var(--high-contrast-icon-fill-light, var(--color-system-linktext));
    }
}
`);
export default sheet;
