import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/shared";
import "./globals.css";
import "./redesign.css";
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "AECS Nepal — A clearer way to study abroad",
    template: "%s | AECS Nepal",
  },
  description:
    "Study-abroad counselling, IELTS, PTE and Duolingo preparation, and exam booking at AECS Nepal in Bagbazar, Kathmandu.",
  openGraph: {
    title: "AECS Nepal — A clearer way to study abroad",
    description:
      "Explore your options. Prepare with purpose. Start with a real conversation.",
    images: [{ url: "/images/student-london.webp", width: 1920, height: 1049 }],
    type: "website",
    locale: "en_NP",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo.webp" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
