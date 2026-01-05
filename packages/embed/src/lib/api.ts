import { joinURL } from "ufo";
import { API_BASE } from "./consts";
import { cache } from "./cache";

export interface Member {
  id: string;
  name: string;
  url: string;
  redirectUrl: string;
  buttonUrl: string;
}

export type EmbedResponse = {
  current?: Member;
  prev: Member;
  next: Member;
  members: Member[];
};
export async function getEmbed() {
  const res = await fetch(joinURL(API_BASE, "/embed"), {
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch /embed: ${res.status}`);
  }
  const data: EmbedResponse = await res.json();
  if (!data.current) {
    let message = `[pagering] member with url "${location.hostname}" not found in webring`;
    if (location.hostname === "localhost") {
      console.warn(message + " (this is expected when developing locally)");
    } else {
      console.error(message);
    }
  }
  console.debug("[pagering] embed data:", data);
  return data;
}
export const getEmbedCached = cache("embed", getEmbed);

export async function getStatus() {
  if (location.host === new URL(API_BASE).host) {
    return { enabled: true };
  }

  const res = await fetch(joinURL(API_BASE, "/embed/status"), {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`[pagering] failed to fetch /embed/status: ${res.status}`);
  }

  const data: { enabled: boolean } = await res.json();
  console.debug("[pagering] embed status:", data);
  return data;
}
export async function setStatus({ enabled }: { enabled: boolean }) {
  const res = await fetch(joinURL(API_BASE, "/embed/status"), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ enabled }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`[pagering] failed to set /embed/status: ${res.status}`);
  }

  console.debug("[pagering] set embed status:", { enabled });
}
