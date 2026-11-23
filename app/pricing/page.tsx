import Link from "next/link";
import { packages, money, reviewed } from "@/lib/content";
import { CheckItem, PageIntro, Invitation } from "@/components/shared";
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
        <div className="price-list">
          {packages.map((p) => (
            <article className="price-item" key={p.name}>
              <div className="price-top">
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.description}</p>
                </div>
                <span className="price-value">{money(p.price)}</span>
              </div>
              <ul className="check-list">
                {p.items.map((i) => (
                  <CheckItem key={i}>{i}</CheckItem>
                ))}
              </ul>
              <Link
                href={
                  "/book?service=" +
                  encodeURIComponent(
                    p.group === "Mock tests" ? "Mock test" : "Exam booking",
                  ) +
                  "&note=" +
                  encodeURIComponent(
                    "I would like to discuss the " + p.name + " package.",
                  )
                }
                className="text-link"
              >
                Ask about this package
              </Link>
            </article>
          ))}
        </div>
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

