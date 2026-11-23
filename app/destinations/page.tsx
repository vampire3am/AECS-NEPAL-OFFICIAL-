import { DestinationExplorer } from "@/components/destination-explorer";
import { PageIntro, Invitation } from "@/components/shared";
export const metadata = { title: "Explore study destinations" };
export default function Destinations() {
  return (
    <>
      <PageIntro title="A world to explore.">
        <p>
          Find the places that interest you, compare their study routes and
          bring your shortlist to a conversation with AECS.
        </p>
      </PageIntro>
      <section className="shell content-section">
        <DestinationExplorer />
      </section>
      <Invitation />
    </>
  );
}

