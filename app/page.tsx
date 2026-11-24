import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { destinations, team, guides } from "@/lib/content";
import {
  StudyHero,
  StartingPoint,
  WorkspaceTour,
} from "@/components/home-experience";
import { Invitation } from "@/components/shared";
export default function Home() {
  return (
    <>
      <StudyHero />
      <nav className="service-rail shell" aria-label="AECS services">
        <Link href="/destinations">
          <span>Find your destination</span>
          <ArrowUpRight />
        </Link>
        <Link href="/courses">
          <span>Prepare for your test</span>
          <ArrowUpRight />
        </Link>
        <Link href="/pricing">
          <span>Know the fees</span>
          <ArrowUpRight />
        </Link>
        <Link href="/my-aecs">
          <span>Follow your application</span>
          <ArrowUpRight />
        </Link>
      </nav>
      <StartingPoint />
      <section className="destination-editorial shell">
        <div className="editorial-heading">
          <h2>
            A world beyond
            <br />
            the obvious.
          </h2>
          <div>
            <p>
              Compare the place, the programme and the practical details. Your
              shortlist should make sense for you.
            </p>
            <Link href="/destinations" className="text-link">
              Explore all 12 destinations <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="destination-mosaic">
          {destinations.slice(0, 4).map((d, i) => (
            <Link
              key={d.slug}
              href={"/destinations/" + d.slug}
              className={"mosaic-destination mosaic-" + i}
            >
              <Image
                src={d.image}
                alt={`A view of ${d.name}`}
                fill
                sizes="(max-width:650px) 92vw,(max-width:900px) 45vw, 40vw"
              />
              <div className="mosaic-caption">
                <span>{d.region}</span>
                <div>
                  <h3>{d.name}</h3>
                  <ArrowUpRight size={25} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="destination-beyond">
          <span>Looking somewhere else?</span>
          {destinations.slice(4).map((d) => (
            <Link key={d.slug} href={"/destinations/" + d.slug}>
              {d.name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <section className="test-studio">
        <div className="shell">
          <div className="editorial-heading">
            <h2>
              Better prepared.
              <br />
              More yourself.
            </h2>
            <div>
              <p>
                Know the format. Work on the skills. Arrive at test day with
                preparation behind you.
              </p>
              <Link href="/courses" className="text-link">
                Find your preparation route <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="test-paths">
            {[
              {
                name: "IELTS",
                subtitle: "Four skills. One focused plan.",
                text: "Speaking practice, writing feedback and timed preparation for Academic or General Training.",
                details: "Listening · Reading · Writing · Speaking",
              },
              {
                name: "PTE",
                subtitle: "Get comfortable with the format.",
                text: "Practise the integrated tasks, timing and computer-based environment with the AECS team.",
                details: "Task practice · Mock sessions · Feedback",
              },
              {
                name: "Duolingo",
                subtitle: "Prepare beyond the questions.",
                text: "Work on the test format and understand the equipment, room and identification requirements.",
                details: "Format · Equipment · Test readiness",
              },
            ].map((t) => (
              <article key={t.name}>
                <div className="test-wordmark">{t.name}</div>
                <h3>{t.subtitle}</h3>
                <p>{t.text}</p>
                <span>{t.details}</span>
                <Link href={"/courses?test=" + t.name} className="text-link">
                  Explore {t.name} <ArrowUpRight size={18} />
                </Link>
              </article>
            ))}
          </div>
          <div className="test-desk">
            <p>
              <CalendarDays size={21} />
              <span>Ready for a mock or an exam booking?</span>
            </p>
            <Link href="/pricing" className="text-link">
              See published fees <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <WorkspaceTour />
      <section className="people-editorial shell">
        <div className="people-introduction">
          <h2>
            Real people.
            <br />
            In your corner.
          </h2>
          <p>
            Your questions deserve more than a forwarded message. Meet the
            people behind your preparation and study plan.
          </p>
          <Link href="/about" className="text-link">
            Meet the AECS team <ArrowUpRight size={18} />
          </Link>
          <div className="people-location">
            <MapPin size={20} />
            <p>
              Adwait Marga, Bagbazar
              <br />
              <strong>Kathmandu, Nepal</strong>
            </p>
          </div>
        </div>
        <div className="people-lineup">
          {team.slice(0, 3).map((t) => (
            <Link href="/about" key={t.name}>
              <div>
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width:650px) 45vw, 22vw"
                />
              </div>
              <h3>{t.name}</h3>
              <p>{t.role}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="reading-room shell">
        <div className="editorial-heading">
          <h2>
            A little reading.
            <br />A clearer picture.
          </h2>
          <Link href="/guides" className="text-link">
            All student guides <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="reading-list">
          {guides.map((g) => (
            <Link href={"/guides/" + g.slug} key={g.slug}>
              <span className="reading-category">{g.category}</span>
              <div>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
              </div>
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </div>
      </section>
      <Invitation />
    </>
  );
}
