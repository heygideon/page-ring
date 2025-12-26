<svelte:options customElement="pagering-link" />

<script lang="ts">
  import styles from "./styles/index.css?inline";

  import { flower } from "./lib/consts";
  import { ArrowRightIcon } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { setStatus } from "./lib/api";

  // https://stackoverflow.com/a/79718503/22946386
  const container = $host();
  const _style = document.createElement("style");
  _style.textContent = styles;
  container.shadowRoot?.appendChild(_style);

  type ThemeValue = "light" | "dark";

  const { theme }: { theme?: ThemeValue | "system" } = $props();
  let systemTheme = $state<ThemeValue>("light");

  onMount(() => {
    if (!theme) {
      console.warn(
        "[pagering] 'theme' prop will soon be required. please set it to 'light', 'dark', or 'system' depending on your site's background colour.",
      );
    }

    const handleChange = () => {
      const query = window.matchMedia("(prefers-color-scheme: dark)");
      systemTheme = query.matches ? "dark" : "light";
    };
    handleChange();

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", handleChange);
    return () => {
      query.removeEventListener("change", handleChange);
    };
  });

  const lightDark = (light: string, dark: string) => {
    switch (theme) {
      case "light":
        return light;
      case "dark":
        return dark;
      case "system":
      default:
        return systemTheme === "dark" ? dark : light;
    }
  };

  function handleClick() {
    console.debug("[pagering] event 'pagering:enable' dispatched");
    window.dispatchEvent(
      new CustomEvent("pagering:enable", { bubbles: true, composed: true }),
    );
    setStatus({ enabled: true });
  }
</script>

<button
  part="link"
  onclick={handleClick}
  class="group flex items-center gap-1.5 font-sans text-sm tracking-normal"
>
  <img part="logo" src={flower} alt="" class="size-4" />
  <span class="font-bold">page ring</span>
  <span class="text-current/50">&middot;</span>
  <span
    part="link-text"
    class={[
      "flex items-center gap-1 transition",
      lightDark(
        "text-link group-hover:text-teal-800",
        "text-teal-400 group-hover:text-teal-300",
      ),
    ]}
  >
    <span
      class={[
        "underline underline-offset-2 [text-decoration-skip-ink:none] group-hover:decoration-wavy",
        lightDark("font-semibold", "font-medium"),
      ]}>enter the webring</span
    >
    <ArrowRightIcon
      strokeWidth={2.5}
      class="size-3 transition-transform group-hover:translate-x-px"
    />
  </span>
</button>

<style>
  :host {
    display: inline-block;
  }
</style>
