import { redirect } from "next/navigation";
import { workspaceActor } from "@/lib/workspace";
import { Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "My AECS",
  robots: { index: false, follow: false },
};
export default async function MyAECS() {
  const actor = await workspaceActor();
  if (!actor) redirect("/sign-in");
  if (actor.staff) redirect("/staff/students");
  return (
    <section className="shell workspace-shell">
      <Workspace />
    </section>
  );
}
