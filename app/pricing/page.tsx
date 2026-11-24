import { PricingExplorer } from "@/components/pricing-explorer";
import Link from "next/link";
import { reviewed } from "@/lib/content";
import { PageIntro, Invitation } from "@/components/shared";
export const metadata = { title: "Fees & packages" };
export default function Pricing() {
  return (
    <>
      <PageIntro title="Clear prices. Room for questions.">
        <p>
          See the packages published by AECS, then confirm the current fee,
          inclusions and available test dates with the exam desk before paying.
        </p>
      </PageIntro>
      <section className="shell content-section">
        <div className="notice">
          Published AECS package rates, checked {reviewed}. These are AECS
          package prices, not a universal official test-provider fee.
          Availability, inclusions and provider conditions must be confirmed
          with the desk.
        </div>
        <PricingExplorer />
        <p className="section-note">
          Source:{" "}
          <a className="text-link" href="https://aecsnepal.com/pricing/">
            AECS published pricing
          </a>
          . No payment is collected on this website. Ask for an itemised
          quotation, current cancellation terms and a receipt before committing.
        </p>
      </section>
      <Invitation />
    </>
  );
}
