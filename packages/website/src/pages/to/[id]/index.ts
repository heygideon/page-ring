import type { APIContext } from "astro";
import { getAllMembers, getCurrentMember } from "~/lib/webring";

export async function GET({ params, url, cookies, redirect }: APIContext) {
  const members = await getAllMembers({ url });
  const member = getCurrentMember(members, params.id!);
  if (!member) {
    return redirect("/");
  }

  cookies.set("webring-enabled", "true", {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "none",
    secure: true,
  });

  return redirect(member.url);
}
