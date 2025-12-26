<svelte:options customElement="pagering-overlay" />

<script lang="ts">
  import styles from "./styles/index.css?inline";

  import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronRightIcon,
    ListIcon,
  } from "@lucide/svelte";

  import { flower } from "./lib/consts";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { RING_BASE } from "./lib/consts";
  import { onMount } from "svelte";
  import { getEmbed, getStatus, setStatus } from "./lib/api";
  import Arrow from "./lib/Arrow.svelte";

  // https://stackoverflow.com/a/79718503/22946386
  const container = $host();
  const _style = document.createElement("style");
  _style.textContent = styles;
  container.shadowRoot?.appendChild(_style);

  let enabled = $state(false);
  let open = $state(true);
  let showDirectory = $state(false);

  onMount(() => {
    getStatus().then((status) => {
      if (status.enabled) {
        enabled = true;
      }
    });

    const enableHandler = () => {
      console.debug("[pagering] event 'pagering:enable' received");
      if (enabled) {
        open = true;
        showDirectory = true;
      } else {
        open = true;
        enabled = true;
      }
    };

    window.addEventListener("pagering:enable", enableHandler);
    return () => {
      window.removeEventListener("pagering:enable", enableHandler);
    };
  });

  function exitWebring() {
    open = true;
    showDirectory = false;
    enabled = false;

    setStatus({ enabled: false });
  }
</script>

{#await getEmbed() then embed}
  {#if embed && enabled}
    {#if open && showDirectory}
      <div
        role="presentation"
        in:fade|global={{ duration: 200 }}
        out:fade|global={{ duration: 200, delay: 100 }}
        class="fixed inset-0 bg-black/30"
        onclick={() => (showDirectory = false)}
      ></div>
    {/if}
    <div
      transition:fly|global={{ duration: 300, easing: cubicOut, x: -4 }}
      class={[
        "border-border fixed top-6 left-6 border-2 bg-white font-sans text-base tracking-normal text-black shadow-lg transition duration-300 ease-in-out",
        !open && "-translate-x-2 -translate-y-2",
      ]}
    >
      <div
        class={[
          "overflow-clip transition-[width,height] duration-300 ease-in-out",
          !open ? "size-8" : showDirectory ? "h-96 w-72" : "h-10 w-72",
        ]}
      >
        <div class="relative isolate flex h-96 w-72 flex-col">
          <div
            class={[
              "flex h-10 items-center px-1 transition duration-300 ease-in-out",
              showDirectory ? "bg-neutral-100" : "bg-white",
            ]}
          >
            <button
              onclick={(ev) => {
                if (ev.detail === 2 && open) {
                  if (!showDirectory) {
                    showDirectory = true;
                  }
                } else {
                  open = !open;
                }
              }}
              class={[
                "group grid size-8 origin-top-left place-items-center transition hover:bg-neutral-200",
                !open && "-translate-x-1 -translate-y-1",
              ]}
            >
              <img src={flower} alt="" class="size-5" />
              <span class="sr-only">Hide</span>
            </button>
            <div
              class={[
                "flex min-w-0 flex-1 origin-left items-center transition duration-300 ease-in-out",
                !open && "opacity-0",
              ]}
            >
              <a
                href={embed.prev.url}
                class="group grid size-8 place-items-center transition hover:bg-neutral-200"
              >
                <ArrowLeftIcon
                  strokeWidth={2.5}
                  class="size-4 transition not-group-hover:text-neutral-600"
                />
                <span class="sr-only">Previous website</span>
              </a>
              <p class="min-w-0 flex-1 text-center">
                <strong>page</strong> by Hack Club
              </p>
              <a
                href={embed.next.url}
                class="group grid size-8 place-items-center transition hover:bg-neutral-200"
              >
                <ArrowRightIcon
                  strokeWidth={2.5}
                  class="size-4 transition not-group-hover:text-neutral-600"
                />
                <span class="sr-only">Next website</span>
              </a>
              <button
                onclick={() => (showDirectory = !showDirectory)}
                class="group grid size-8 place-items-center transition hover:bg-neutral-200"
              >
                <ListIcon
                  strokeWidth={2.5}
                  class="size-4 transition not-group-hover:text-neutral-600"
                />
                <span class="sr-only">Hide</span>
              </button>
            </div>
          </div>
          <hr class="border-neutral-300" />
          <div
            class="pointer-events-none absolute top-8.75 right-3.5 h-1.5 overflow-clip"
          >
            <Arrow
              class={[
                "transition-transform",
                !showDirectory && "translate-y-full",
              ]}
            />
          </div>
          <div
            class={[
              "relative -z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 transition",
              !showDirectory && "-translate-y-4 opacity-0",
            ]}
          >
            <div class="group">
              {#each embed.members as member (member.id)}
                <a
                  href={member.url}
                  aria-disabled={embed.current?.id === member.id}
                  class="ring-link flex items-center gap-2 p-1.5 shadow-none transition group-has-hover:not-hover:opacity-75 hover:bg-teal-100 hover:ring-1 aria-disabled:pointer-events-none"
                >
                  <img
                    src={member.buttonUrl}
                    alt=""
                    width="88"
                    height="31"
                    class="flex-none"
                  />
                  <div class="min-w-0 flex-1 *:leading-none">
                    <p class="mb-0.5 text-sm font-semibold">{member.name}</p>
                    {#if embed.current?.id === member.id}
                      <div class="text-link flex items-center gap-px text-xs">
                        <ChevronRightIcon
                          strokeWidth={2.5}
                          class="-ml-0.5 size-3"
                        />
                        <span class="font-semibold">current</span>
                      </div>
                    {:else}
                      <p class="text-xs text-neutral-600">
                        {new URL(member.url).hostname}
                      </p>
                    {/if}
                  </div>
                </a>
              {/each}
            </div>
            <div class="px-1.5 pb-1.5 text-sm">
              <hr class="my-3 border-dashed border-neutral-200" />
              <p class="text-neutral-600">
                this is a collection of personal websites made by members of
                Hack Club.
              </p>
              <div class="mt-1.5 flex gap-3">
                <a
                  href={RING_BASE}
                  target="_blank"
                  class="text-link font-semibold transition hover:text-teal-900 hover:underline"
                >
                  read more
                </a>
                <button
                  onclick={exitWebring}
                  class="font-semibold text-red-700 transition hover:text-red-900 hover:underline"
                >
                  exit webring
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/await}

<style>
  :host {
    user-select: none;
    position: relative;
    z-index: calc(infinity);
  }
</style>
