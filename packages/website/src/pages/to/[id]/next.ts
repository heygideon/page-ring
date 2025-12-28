import type { APIContext } from "astro";
import { getAdjacentMembers, getAllMembers } from "~/lib/webring";

export async function GET({ params, url, redirect }: APIContext) {
  const members = await getAllMembers({ url });
  const { next } = getAdjacentMembers(members, params.id!);
  if (!next) {
    return redirect("/");
  }

  return redirect(`/to/${next.id}`);
}
