import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { guides } from "@/lib/content";
import { PageIntro } from "@/components/shared";
export const metadata = { title: "Student guides" };
export default function Guides() {
  return (
    <>
      <PageIntro title="Good questions. Useful reading.">
        <p>
          Practical starting points for your study plan, English preparation and
          first conversation with a counsellor.
        </p>
      </PageIntro>
      <section className="shell content-section guide-grid">
        {guides.map((g, i) => (
          <Link href={"/guides/" + g.slug} className="guide-card" key={g.slug}>
            <div className={"guide-art guide-art-" + i}>
              <BookOpen size={34} />
              <span>
                {
                  [
                    "Find your English test.",
                    "Build your budget.",
                    "Make the first meeting count.",
                  ][i]
                }
              </span>
            </div>
            <p className="secondary-label">{g.category}</p>
            <h2 style={{ fontSize: "1.5rem" }}>{g.title}</h2>
            <p>{g.description}</p>
            <span className="text-link">
              Read the guide <ArrowUpRight size={17} />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
