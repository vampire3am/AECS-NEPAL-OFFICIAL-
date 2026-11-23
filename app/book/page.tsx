import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { business } from "@/lib/content";
import { BookingForm } from "@/components/booking-form";
import { PageIntro } from "@/components/shared";
export const metadata = { title: "Book a conversation" };
export default async function Book({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    destination?: string;
    note?: string;
  }>;
}) {
  const query = await searchParams;
  return (
    <>
      <PageIntro title="Let’s make your next step clearer.">
        <p>
          Tell us what’s on your mind. Your first counselling session is free,
          and you don’t need all the answers before you begin.
        </p>
      </PageIntro>
      <section className="shell booking-layout content-section">
        <aside>
          <h2>
            One conversation.
            <br />A useful starting point.
          </h2>
          <p style={{ marginTop: 22 }}>
            We’ll save your request and contact you to confirm a time with the
            right desk.
          </p>
          <div className="contact-details">
            <a href={business.map}>
              <MapPin size={20} />
              <span>{business.address}</span>
            </a>
            <div>
              <Clock size={20} />
              <span>{business.hours}</span>
            </div>
            <a href={"tel:" + business.tel}>
              <Phone size={20} />
              {business.phone}
            </a>
            <a href={"mailto:" + business.email}>
              <Mail size={20} />
              {business.email}
            </a>
          </div>
          <p className="section-note">
            Prefer to speak now?{" "}
            <a className="text-link" href={business.whatsapp}>
              Message the AECS desk
            </a>
            .
          </p>
        </aside>
        <BookingForm {...query} />
      </section>
    </>
  );
}

