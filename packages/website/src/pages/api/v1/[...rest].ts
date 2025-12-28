import { zValidator } from "@hono/zod-validator";
import type { APIContext } from "astro";
import { z } from "astro/zod";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import {
  getAdjacentMembers,
  getAllMembers,
  getCurrentMember,
} from "~/lib/webring";

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

const app = new Hono().basePath("/api/v1");
// CORS for embed endpoints - allow credentials
app.use(
  "/embed/*",
  cors({
    origin: (origin) => origin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);
// CORS for other endpoints
app.use(
  "/*",
  cors({
    origin: (origin) => origin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/members", async (c) => {
  const members = await getAllMembers({ url: new URL(c.req.url) });
  return c.json(members);
});
app.get("/members/:id", async (c) => {
  const param = c.req.param();
  const members = await getAllMembers({ url: new URL(c.req.url) });

  const current = getCurrentMember(members, param.id);
  const { prev, next } = getAdjacentMembers(members, param.id);

  if (!current || !prev || !next) {
    return c.text("Member not found", 404);
  }

  return c.json({
    current,
    prev,
    next,
  });
});

app.get("/embed", async (c) => {
  const origin = c.req.header("Origin");
  const originHostname = getHostname(origin || "") || "";

  const members = await getAllMembers({ url: new URL(c.req.url) });

  let current =
    members.find((member) => getHostname(member.url) === originHostname) ||
    null;

  let prev, next;
  if (current) {
    const adjacent = getAdjacentMembers(members, current.id);
    if (!adjacent.prev || !adjacent.next) {
      return c.text("No adjacent members", 500);
    }
    prev = adjacent.prev;
    next = adjacent.next;
  } else {
    prev = members[members.length - 1];
    next = members[0];
  }

  return c.json({
    current,
    prev,
    next,
    members,
  });
});

app.get("/embed/status", async (c) => {
  const webringCookie = getCookie(c, "webring-enabled");
  const enabled = webringCookie === "true";
  return c.json({ enabled });
});

app.post(
  "/embed/status",
  zValidator("json", z.object({ enabled: z.boolean() })),
  async (c) => {
    const body = c.req.valid("json");
    if (body.enabled) {
      setCookie(c, "webring-enabled", "true", {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "None",
        secure: true,
      });
    } else {
      deleteCookie(c, "webring-enabled", {
        path: "/",
        sameSite: "None",
        secure: true,
      });
    }
    return c.json({ success: true });
  },
);

export function ALL({ request }: APIContext) {
  return app.fetch(request);
}
