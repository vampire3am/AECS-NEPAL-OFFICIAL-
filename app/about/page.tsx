import Image from "next/image";
import Link from "next/link";
import { team, reviewed } from "@/lib/content";
import { PageIntro, Invitation } from "@/components/shared";
export const metadata = { title: "Meet AECS Nepal" };
export default function About() {
  return (
    <>
      <PageIntro title="A team you can talk to.">
        <p>
          AECS brings study-abroad counselling, English preparation and exam
          support together in Bagbazar, Kathmandu.
        </p>
      </PageIntro>
      <section className="shell content-section">
        <div className="two-column">
          <h2>
            Your plans deserve
            <br />
            individual attention.
          </h2>
          <div>
            <p>
              Every student arrives with different questions. The right
              conversation connects your previous study, interests, budget and
              timing before a shortlist takes shape.
            </p>
            <p style={{ marginTop: 22 }}>
              Meet some of the people listed on AECS’s official team page. Ask
              who will guide your particular study route and how to stay in
              touch.
            </p>
          </div>
        </div>
        <div className="team-grid">
          {team.map((t) => (
            <article key={t.name} className="team-member">
              <div className="team-image">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width:600px) 45vw, 25vw"
                />
              </div>
              <h3>{t.name}</h3>
              <p className="role">{t.role}</p>
              <p>{t.text}</p>
            </article>
          ))}
        </div>
        <p className="section-note">
          Team information from{" "}
          <a className="text-link" href="https://aecsnepal.com/about-us/">
            AECS’s published team profiles
          </a>
          , reviewed {reviewed}.
        </p>
      </section>
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell two-column" style={{ alignItems: "center" }}>
          <div
            className="image-wrap"
            style={{
              height: 330,
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
            }}
          >
            <Image
              src="/images/pearson-award.webp"
              alt="AECS representatives at the Pearson award presentation"
              fill
              sizes="(max-width:600px) 90vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h2>Recognition you can ask about.</h2>
            <p style={{ marginTop: 24 }}>
              AECS publishes its Pearson PTE Top Achiever recognition and
              displays partner credentials at the centre. The team can explain
              the award, its year and what each authorisation covers.
            </p>
            <Link href="/book" className="text-link" style={{ marginTop: 24 }}>
              Visit the Bagbazar centre
            </Link>
          </div>
        </div>
      </section>
      <Invitation />
    </>
  );
}

