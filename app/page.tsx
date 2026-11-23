import Link from "next/link";
import Image from "next/image";
import { BookOpen, Globe2, CalendarDays, MapPin, Check } from "lucide-react";
import { destinations, guides } from "@/lib/content";
import { Invitation } from "@/components/shared";
export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <h1>
            Your ambition.
            <br />A world of
            <br />
            <span>possibilities.</span>
          </h1>
          <p>
            Find a study route that fits you. Honest counselling, focused
            English preparation and a team in Kathmandu to help you take the
            next step.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/plan">
              Build my study plan
            </Link>
            <Link className="text-link" href="/book">
              Meet a counsellor
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="small-line" />
            <span>
              From Bagbazar.
              <br />
              <strong>With your future in mind.</strong>
            </span>
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/student-london.webp"
            alt="A student with a backpack looking across Westminster Bridge in London"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <div className="photo-caption">
            <MapPin size={16} />
            <span>London, United Kingdom</span>
          </div>
          <div className="photo-corner">
            <span>
              Your journey starts
              <br />
              with a conversation.
            </span>
            <Link href="/book" aria-label="Book a conversation with AECS">
              <CalendarDays size={22} />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="service-paths shell"
        aria-label="Choose your next step"
      >
        <Link href="/destinations">
          <Globe2 size={26} />
          <div>
            <h2>I want to study abroad</h2>
            <p>Explore destinations and your options.</p>
          </div>
          <span className="path-plus">+</span>
        </Link>
        <Link href="/courses">
          <BookOpen size={26} />
          <div>
            <h2>I’m preparing for English</h2>
            <p>Find your IELTS, PTE or Duolingo route.</p>
          </div>
          <span className="path-plus">+</span>
        </Link>
        <Link href="/book?service=Exam%20booking">
          <CalendarDays size={26} />
          <div>
            <h2>I’m ready to book a test</h2>
            <p>Get help with dates, fees and details.</p>
          </div>
          <span className="path-plus">+</span>
        </Link>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <h2>
              Where could your
              <br />
              next chapter take you?
            </h2>
            <p>Start with curiosity. Compare the details that matter to you.</p>
          </div>
          <Link href="/destinations" className="text-link">
            Explore all destinations
          </Link>
        </div>
        <div className="destination-feature-grid">
          {destinations.slice(0, 4).map((d, i) => (
            <Link
              key={d.slug}
              href={"/destinations/" + d.slug}
              className={"destination-feature destination-feature-" + i}
            >
              <div className="image-wrap">
                <Image
                  src={d.image}
                  alt={`${d.name} destination view`}
                  fill
                  sizes="(max-width:600px) 90vw, (max-width:900px) 45vw, 25vw"
                />
              </div>
              <div className="destination-caption">
                <div>
                  <span>{d.region}</span>
                  <h3>{d.name}</h3>
                </div>
                <span aria-hidden="true">+</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="preparation-section">
        <div className="shell preparation-grid">
          <div>
            <h2>
              A little practice.
              <br />A lot more confidence.
            </h2>
            <p>
              Learn the format. Work on the skills. Get feedback that helps you
              improve before test day.
            </p>
            <Link href="/courses" className="button button-light">
              Find your preparation course
            </Link>
            <p className="muted-light">
              IELTS · PTE Academic · Duolingo English Test
            </p>
          </div>
          <div className="course-list">
            {[
              [
                "IELTS",
                "Academic & General Training",
                "Reading, writing, listening and speaking.",
              ],
              [
                "PTE",
                "Computer-based preparation",
                "Timed practice and real-format lab sessions.",
              ],
              [
                "Duolingo",
                "Online English test preparation",
                "Build familiarity with the format and setup.",
              ],
            ].map(([name, label, description]) => (
              <Link key={name} href={"/courses?test=" + name}>
                <div>
                  <h3>{name}</h3>
                  <span>{label}</span>
                </div>
                <p>{description}</p>
                <span className="path-plus" aria-hidden="true">
                  +
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section shell people-section">
        <div className="people-portrait">
          <Image
            src="/images/arun.webp"
            alt="Arun Upadhyaya, AECS Founder and Managing Director"
            fill
            sizes="(max-width:760px) 90vw, 40vw"
          />
          <div>
            <strong>Arun Upadhyaya</strong>
            <span>Founder & Managing Director</span>
          </div>
        </div>
        <div className="people-copy">
          <h2>
            Real people.
            <br />
            Thoughtful guidance.
          </h2>
          <p>
            Choosing where to study is personal. Your interests, your family’s
            priorities and your starting point all belong in the conversation.
          </p>
          <p>
            At AECS, counselling and English preparation happen under the same
            roof—so your next steps stay connected.
          </p>
          <ul className="check-list">
            <li>
              <Check size={18} />A free initial counselling session
            </li>
            <li>
              <Check size={18} />
              Clear package pricing before you commit
            </li>
            <li>
              <Check size={18} />A team you can meet in Bagbazar
            </li>
          </ul>
          <Link href="/about" className="text-link">
            Get to know AECS
          </Link>
        </div>
      </section>
      <section className="guides-section section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <h2>A clearer starting point.</h2>
              <p>Useful reading for the questions on your mind.</p>
            </div>
            <Link href="/guides" className="text-link">
              All student guides
            </Link>
          </div>
          <div className="guide-grid">
            {guides.map((g, i) => (
              <Link
                href={"/guides/" + g.slug}
                key={g.slug}
                className="guide-card"
              >
                <div className={"guide-art guide-art-" + i}>
                  <BookOpen size={34} />
                  <span>
                    {
                      [
                        "Find your test",
                        "Know your budget",
                        "Start the conversation",
                      ][i]
                    }
                  </span>
                </div>
                <p className="secondary-label">{g.category}</p>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
                <span className="text-link">Read the guide</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Invitation />
    </>
  );
}

