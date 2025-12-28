import type { APIContext } from "astro";
import { getAdjacentMembers, getAllMembers } from "~/lib/webring";

export async function GET({ params, url, redirect }: APIContext) {
  const members = await getAllMembers({ url });
  const { prev } = getAdjacentMembers(members, params.id!);
  if (!prev) {
    return redirect("/");
  }

  return redirect(`/to/${prev.id}`);
}
