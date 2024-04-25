const sheet = new CSSStyleSheet();
sheet.replaceSync(`.visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
}

.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
}

@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
    }
}

.forced-colors *:not(button):not(.animated-icon),
.forced-colors *::before,
.forced-colors *::after {
    text-decoration-color: unset !important;
    text-emphasis-color: unset !important;
    border-color: unset !important;
    outline-color: unset !important;
    column-rule-color: unset !important;
    -webkit-tap-highlight-color: unset !important;
    box-shadow: none !important;
    text-shadow: none !important;
    background-image: none !important;
    color-scheme: light dark !important;
    scrollbar-color: auto !important;
}

@media (forced-colors: active) {
    button,
    .animated-icon {
        forced-color-adjust: none;
    }
}

.skip-link {
    background: var(--color-utils-red);
    color: var(--color-utils-white);
    font-weight: var(--font-weight-more-bold);
    font-family: var(--font-family-default);
    left: 50%;
    padding: var(--content-spacing-medium);
    border-radius: var(--border-radius-small);
    position: absolute;
    transform: translate(-50%, -100%);
    z-index: var(--index-somewhatimportant);
    text-decoration: none;
}

.skip-link:focus {
    transform: translate(-50%, 0%);
    transition: transform 0.3s ease;
}

img {
    display: block;
}

img::before {
    content: "";
    width: 100%;
    height: 100%;
    background-color: var(--color-utils-gray);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0;
}

img::after {
    content: "\2639"" " attr(alt);
    font-size: var(--font-size-medium);
    color: var(--color-utils-white);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
`);
export default sheet;
