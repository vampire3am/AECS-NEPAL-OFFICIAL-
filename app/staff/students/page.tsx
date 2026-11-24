import { redirect } from "next/navigation";
import { getStaff } from "@/lib/auth";
import { Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Student desk",
  robots: { index: false, follow: false },
};
export default async function Students() {
  if (!(await getStaff())) redirect("/staff/sign-in");
  return (
    <section className="shell workspace-shell">
      <Workspace staff />
    </section>
  );
}
