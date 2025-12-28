import type { APIContext } from "astro";
import { getAllMembers } from "~/lib/webring";

export async function GET({ url, redirect }: APIContext) {
  const members = await getAllMembers({ url });
  const randomMember = members[Math.floor(Math.random() * members.length)];

  return redirect(`/to/${randomMember.id}`);
}
