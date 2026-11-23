import { PageIntro } from "@/components/shared";
import { reviewed } from "@/lib/content";
export const metadata = { title: "Website terms" };
export default function Terms() {
  return (
    <>
      <PageIntro title="Clear expectations from the start.">
        <p>Website terms, reviewed {reviewed}.</p>
      </PageIntro>
      <article className="shell article legal">
        <h2>Information and guidance</h2>
        <p>
          Website content is a starting point for discussion. Admission,
          scholarships and immigration decisions are made by the relevant
          institutions and authorities. AECS does not guarantee those outcomes.
        </p>
        <h2>Prices and bookings</h2>
        <p>
          Displayed package prices are sourced from AECS’s published pricing and
          carry a review date. Confirm current rates, inclusions, availability
          and cancellation conditions with the desk before payment. This website
          does not collect payments or reserve a confirmed exam or counselling
          slot.
        </p>
        <h2>Your requests</h2>
        <p>
          Submit accurate information that you are entitled to share. A saved
          request reference confirms receipt by the system; it does not confirm
          an appointment, admission, exam registration or service agreement.
        </p>
        <h2>External resources</h2>
        <p>
          Linked institutions, official test providers, maps and messaging
          services operate independently. Check their current terms and
          requirements directly.
        </p>
        <h2>Questions</h2>
        <p>
          Contact the AECS Bagbazar desk at info@aecsnepal.com or +977
          970-451-8337 for clarification before committing to a service.
        </p>
      </article>
    </>
  );
}

