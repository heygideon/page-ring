import { joinURL } from "ufo";

export const RING_BASE = import.meta.env.PROD ? "" : "http://localhost:4321/";
export const API_BASE = joinURL(RING_BASE, "/api/v1");

export const flower = joinURL(RING_BASE, "/flower.png");
