<svelte:options customElement="pagering-link" />

<script lang="ts">
  import styles from "./styles/index.css?inline";

  import { flower } from "./lib/consts";
  import { ArrowLeftIcon, ArrowRightIcon } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getEmbedCached } from "./lib/api";

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
</script>

<div class={["flex min-h-7", lightDark("text-black", "text-white")]}>
  {#await getEmbedCached() then embed}
    <a
      href={embed.prev.redirectUrl}
      title={`prev: ${embed.prev.name}`}
      class={[
        "grid size-7 place-items-center transition hover:ring-1",
        lightDark(
          "ring-black/20 hover:bg-black/5",
          "ring-white/20 hover:bg-white/10",
        ),
      ]}
    >
      <ArrowLeftIcon
        strokeWidth={2.5}
        class="size-4 transition-transform group-hover:translate-x-px"
      />
    </a>
    <button
      onclick={() => window.pagering.open()}
      title="enter webring"
      class={[
        "group flex h-7 items-center gap-1.5 px-2 font-sans text-sm tracking-normal transition hover:ring-1",
        lightDark(
          "ring-black/20 hover:bg-black/5",
          "ring-white/20 hover:bg-white/10",
        ),
      ]}
    >
      <img src={flower} alt="" class="size-5" />
      <span class="font-bold">page ring</span>
    </button>
    <a
      href={embed.next.redirectUrl}
      title={`next: ${embed.next.name}`}
      class={[
        "grid size-7 place-items-center transition hover:ring-1",
        lightDark(
          "ring-black/20 hover:bg-black/5",
          "ring-white/20 hover:bg-white/10",
        ),
      ]}
    >
      <ArrowRightIcon
        strokeWidth={2.5}
        class="size-4 transition-transform group-hover:translate-x-px"
      />
    </a>
  {/await}
</div>

<style>
  :host {
    display: block;
    width: fit-content;
  }
</style>
