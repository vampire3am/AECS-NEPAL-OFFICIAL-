import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, reviewed } from "@/lib/content";
import { Invitation } from "@/components/shared";
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: guides.find((g) => g.slug === slug)?.title || "Guide not found",
  };
}
export default async function Guide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((g) => g.slug === slug);
  if (!g) notFound();
  return (
    <>
      <header className="page-intro shell">
        <Link href="/guides" className="breadcrumb">
          Student guides
        </Link>
        <h1>{g.title}</h1>
        <p className="lede">{g.description}</p>
        <p className="section-note">
          AECS planning guide · Reviewed {reviewed}
        </p>
      </header>
      <article className="shell article content-section">
        {g.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        <div className="notice" style={{ marginTop: 35 }}>
          This is general preparation guidance. Requirements and fees depend on
          your test, institution and study route. Confirm current details with
          official providers and your counsellor.
        </div>
        <Link href="/book" className="button">
          Discuss my questions
        </Link>
      </article>
      <Invitation />
    </>
  );
}

