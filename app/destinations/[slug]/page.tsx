import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, reviewed } from "@/lib/content";
import { Invitation } from "@/components/shared";
export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = destinations.find((d) => d.slug === slug);
  return {
    title: d ? "Study in " + d.name : "Destination not found",
    description: d?.intro,
  };
}
export default async function Destination({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = destinations.find((d) => d.slug === slug);
  if (!d) notFound();
  return (
    <>
      <div className="shell page-intro">
        <Link className="breadcrumb" href="/destinations">
          All destinations
        </Link>
        <div className="detail-hero">
          <div>
            <h1>
              Study in
              <br />
              {d.name}.
            </h1>
            <p className="lede">{d.intro}</p>
            <Link
              href={"/book?destination=" + encodeURIComponent(d.name)}
              className="button"
            >
              Discuss my options
            </Link>
          </div>
          <div className="image-wrap">
            <Image
              src={d.image}
              alt={`${d.name} destination view`}
              fill
              priority
              sizes="(max-width:600px) 90vw, 50vw"
            />
          </div>
        </div>
        <div className="two-column">
          <div>
            <h2>Start with the right questions.</h2>
            <ul className="check-list">
              {d.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p>
              AECS helps connect your academic background, preferred subject and
              family budget to a considered shortlist. Course and immigration
              requirements need checking against current official sources for
              your particular route.
            </p>
          </div>
          <aside className="panel">
            <h2>Your planning notes</h2>
            <p>
              <strong>Focus:</strong> {d.focus}
            </p>
            <p>
              <strong>Course language:</strong> {d.language}
            </p>
            <p>
              <strong>Bring:</strong> your latest qualification, subject
              interests, intended intake and any English test results.
            </p>
            <Link href="/plan" className="text-link" style={{ marginTop: 22 }}>
              Build a starting plan
            </Link>
          </aside>
        </div>
        <p className="section-note">
          Route overview reviewed {reviewed}.{" "}
          <a
            className="text-link"
            href={"https://aecsnepal.com/study-abroad/" + d.slug + "/"}
          >
            AECS source page
          </a>
          . This page does not promise admission, work rights or visa approval.
          Ask for a dated institution-specific assessment.
        </p>
      </div>
      <Invitation />
    </>
  );
}

