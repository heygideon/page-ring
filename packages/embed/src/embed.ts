import "./Overlay.svelte";
import "./Link.svelte";

import styles from "./styles/fonts.css?url";

const pagering = {
  open: () => {
    console.debug("[pagering] event 'pagering:enable' dispatched");
    window.dispatchEvent(
      new CustomEvent("pagering:enable", { bubbles: true, composed: true }),
    );
  },
};
Object.defineProperty(window, "pagering", {
  value: pagering,
  writable: false,
  configurable: false,
});
declare global {
  interface Window {
    pagering: typeof pagering;
  }
}

const overlay = document.createElement("pagering-overlay");
document.body.append(overlay);

const linkStyle = document.createElement("link");
linkStyle.rel = "stylesheet";
linkStyle.href = styles;
document.head.appendChild(linkStyle);
