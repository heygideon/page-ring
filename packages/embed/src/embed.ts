import "./Overlay.svelte";

import styles from "./styles/fonts.css?url";

if (window.location.hash.includes("pagering-v2")) {
  import("./Link_v2.svelte");
} else {
  import("./Link.svelte");
}

const overlay = document.createElement("pagering-overlay");
document.body.append(overlay);

const linkStyle = document.createElement("link");
linkStyle.rel = "stylesheet";
linkStyle.href = styles;
document.head.appendChild(linkStyle);
