import "./Overlay.svelte";
import "./Link_v2.svelte";

import styles from "./styles/fonts.css?url";

const overlay = document.createElement("pagering-overlay");
document.body.append(overlay);

const linkStyle = document.createElement("link");
linkStyle.rel = "stylesheet";
linkStyle.href = styles;
document.head.appendChild(linkStyle);
