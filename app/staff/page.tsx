import Link from "next/link";
import { getStaff, getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StaffInbox } from "@/components/staff-inbox";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Staff enquiry desk",
  robots: { index: false, follow: false },
};
export default async function Staff() {
  const staff = await getStaff();
  if (!staff) {
    const { data } = await getAuth().getSession();
    if (data?.user)
      return (
        <section className="shell content-section" style={{ paddingTop: 70 }}>
          <h1>Staff authorisation required.</h1>
          <p className="lede">
            This signed-in account is not an authorised, verified AECS owner. No
            enquiry information is available.
          </p>
          <StaffInbox denied />
        </section>
      );
    redirect("/staff/sign-in");
  }
  return (
    <section className="shell content-section" style={{ paddingTop: 55 }}>
      <nav className="desk-nav" aria-label="Staff desk">
        <Link href="/staff" aria-current="page">
          Enquiries
        </Link>
        <Link href="/staff/students">Student workspaces</Link>
      </nav>
      <StaffInbox staffEmail={staff.email} />
    </section>
  );
}
