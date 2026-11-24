import { StaffSignIn } from "@/components/staff-sign-in";
export const metadata = {
  title: "Sign in to My AECS",
  robots: { index: false, follow: false },
};
export default function SignIn() {
  return (
    <section className="shell content-section" style={{ paddingTop: 60 }}>
      <StaffSignIn student />
    </section>
  );
}
