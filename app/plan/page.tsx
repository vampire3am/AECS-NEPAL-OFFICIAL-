import { StudyPlanner } from "@/components/study-planner";
import { PageIntro } from "@/components/shared";
export const metadata = { title: "My study plan" };
export default function Plan() {
  return (
    <>
      <PageIntro title="Your future. Your starting point.">
        <p>
          A few useful questions, one simple worksheet. Explore your priorities
          and bring a clearer starting point to your counsellor.
        </p>
      </PageIntro>
      <section className="shell content-section">
        <StudyPlanner />
      </section>
    </>
  );
}

