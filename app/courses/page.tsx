import { Courses } from "@/components/courses";
import { Invitation, PageIntro } from "@/components/shared";
export const metadata = { title: "IELTS, PTE & Duolingo preparation" };
export default function Page() {
  return (
    <>
      <PageIntro title="Preparation that builds confidence.">
        <p>
          Choose a test your route accepts. Learn its format, practise the
          skills and make progress with feedback from the AECS team.
        </p>
      </PageIntro>
      <section className="shell content-section">
        <Courses />
        <div className="faq">
          <h2>A few things to know.</h2>
          <details>
            <summary>How long should I prepare?</summary>
            <p>
              Your starting level and target score matter. Ask for a diagnostic
              mock and a preparation plan before choosing a class duration.
            </p>
          </details>
          <details>
            <summary>Can AECS help with booking?</summary>
            <p>
              Yes. The exam desk helps with the appropriate test, available
              slots, identification requirements and booking details. Your test
              slot is confirmed separately.
            </p>
          </details>
          <details>
            <summary>Do you have current class times?</summary>
            <p>
              Contact the Bagbazar desk for current batches and instructor
              availability. Your preferred time is a request until the team
              confirms it.
            </p>
          </details>
        </div>
      </section>
      <Invitation />
    </>
  );
}

