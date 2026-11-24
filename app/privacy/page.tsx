import { PageIntro } from "@/components/shared";
import { business, reviewed } from "@/lib/content";
export const metadata = { title: "Privacy notice" };
export default function Privacy() {
  return (
    <>
      <PageIntro title="Your information has a purpose.">
        <p>
          Privacy notice for the AECS Nepal website. Last reviewed {reviewed}.
        </p>
      </PageIntro>
      <article className="shell article legal">
        <h2>What we collect</h2>
        <p>
          When you request a conversation, we save your name, phone number,
          optional email, service interest, destination, meeting preference,
          optional date and message. We record when you consent and a request
          reference.
        </p>
        <h2>How we use it</h2>
        <p>
          AECS uses your request to prepare for counselling, contact you and
          manage follow-up. Your preferred date is a request until staff
          confirms a time. Information is available only through the private
          staff workspace to authorised staff.
        </p>
        <h2>Where information is processed</h2>
        <p>
          The website runs on Vercel. Request data is stored in a Neon Postgres
          database in Singapore. Student and staff sign-in use managed Neon
          Auth. Private documents are stored in a branch-scoped Neon object
          storage bucket in Singapore. These services process technical
          information needed to provide the website and authentication.
        </p>
        <h2>Your device and external services</h2>
        <p>
          Destination shortlists and saved study plans use your browser’s local
          storage. They stay on that device until you clear them. A browser plan
          is shared with AECS when you import and save it in My AECS or submit
          its details in a booking request. WhatsApp, map and social links open
          their respective services, which have their own privacy practices. No
          advertising trackers or automatically loaded social embeds are
          included.
        </p>
        <h2>My AECS accounts and workspaces</h2>
        <p>
          When you sign in, we process your verified email and account details.
          If you use My AECS, we save your profile, study plan, shortlist,
          budget estimates, appointments, messages, document uploads and the
          application or task updates entered by AECS. These records are
          available to you and the authorised AECS owner. We record changes and
          document downloads in an audit trail. Uploaded files are private and
          are not published as public links. Messages are shown in your
          workspace; automatic message email notifications are not enabled.
        </p>
        <h2>Security and retention</h2>
        <p>
          We use server-side validation and access controls. Abuse prevention
          uses a keyed hash derived from connection information and a short time
          window. AECS should retain enquiries only while they are needed for
          follow-up and applicable obligations. Contact AECS to request deletion
          of account records and stored documents. Upload only requested
          documents inside your signed-in workspace. Do not submit passport
          numbers, payment-card details, account passwords or financial
          documents through this form.
        </p>
        <h2>Your choices</h2>
        <p>
          You can request access, correction or deletion of your enquiry by
          contacting <a href={"mailto:" + business.email}>{business.email}</a>{" "}
          or {business.phone}. Provide your request reference if you have it.
          You may also call or visit instead of using the form.
        </p>
      </article>
    </>
  );
}
