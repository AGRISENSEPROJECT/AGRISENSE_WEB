import { Link } from "react-router-dom";
import LegalLayout, { LegalSectionBlock } from "./LegalLayout";

const sections = [
  { id: "acceptance", heading: "1. Acceptance of Terms" },
  { id: "eligibility", heading: "2. Eligibility" },
  { id: "accounts", heading: "3. Your Account" },
  { id: "use", heading: "4. Acceptable Use" },
  { id: "services", heading: "5. Services & AI Recommendations" },
  { id: "content", heading: "6. User Content" },
  { id: "third-party", heading: "7. Third-Party Services" },
  { id: "ip", heading: "8. Intellectual Property" },
  { id: "disclaimers", heading: "9. Disclaimers" },
  { id: "liability", heading: "10. Limitation of Liability" },
  { id: "termination", heading: "11. Termination" },
  { id: "changes", heading: "12. Changes to These Terms" },
  { id: "law", heading: "13. Governing Law" },
  { id: "contact", heading: "14. Contact Us" },
];

const TermsOfService = () => {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="August 3, 2026"
      intro="These Terms govern your access to and use of the AgriSense platform, including our website, dashboards, and related services. Please read them carefully."
      sections={sections}
    >
      <LegalSectionBlock id="acceptance" heading="1. Acceptance of Terms">
        <p>
          By creating an account, accessing, or using AgriSense (the "Service"), you agree to be
          bound by these Terms of Service and our{" "}
          <Link to="/legal/privacy" className="font-medium text-[#2C6E49] hover:underline">
            Privacy Policy
          </Link>
          . If you do not agree, you may not use the Service.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="eligibility" heading="2. Eligibility">
        <p>
          You must be at least 18 years old, or the age of majority in your jurisdiction, and able
          to form a binding contract to use the Service. If you use the Service on behalf of an
          organization (such as a cooperative, NGO, government body, or supplier), you represent
          that you are authorized to bind that organization to these Terms.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="accounts" heading="3. Your Account">
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for
          all activity under your account. You agree to provide accurate information, keep it up to
          date, and notify us immediately of any unauthorized use. We are not liable for losses
          arising from your failure to safeguard your account.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="use" heading="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Use the Service for any unlawful, harmful, or fraudulent purpose.</li>
          <li>Upload malicious code, spam, or content that infringes the rights of others.</li>
          <li>Attempt to gain unauthorized access to the Service or other users' accounts.</li>
          <li>Reverse engineer, scrape, or overload our systems or APIs.</li>
          <li>Misrepresent your identity or affiliation with any person or organization.</li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock id="services" heading="5. Services & AI Recommendations">
        <p>
          AgriSense provides data-driven insights, including crop recommendations, soil and weather
          analysis, and market information. These outputs are generated using models and third-party
          data and are provided for informational purposes only.
        </p>
        <p>
          <strong>They do not constitute professional agronomic, financial, or legal advice.</strong>{" "}
          You are solely responsible for decisions you make based on the Service, and we encourage
          you to consult qualified experts before acting on any recommendation.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="content" heading="6. User Content">
        <p>
          You retain ownership of content you submit (such as community posts, farm details, and
          images). By submitting content, you grant AgriSense a worldwide, non-exclusive, royalty-free
          license to host, store, display, and use it to operate and improve the Service. You are
          responsible for ensuring you have the rights to any content you upload.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="third-party" heading="7. Third-Party Services">
        <p>
          The Service integrates third-party data and services (for example, weather data providers
          and mapping/geocoding services). We are not responsible for the accuracy, availability, or
          practices of third parties, and your use of such data may be subject to their terms.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="ip" heading="8. Intellectual Property">
        <p>
          The Service, including its software, design, logos, and content (excluding user content),
          is owned by AgriSense and protected by intellectual property laws. We grant you a limited,
          non-transferable, revocable license to use the Service in accordance with these Terms.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="disclaimers" heading="9. Disclaimers">
        <p>
          The Service is provided on an "as is" and "as available" basis without warranties of any
          kind, whether express or implied, including fitness for a particular purpose and
          non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or
          that recommendations will produce any particular outcome, including crop yields.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="liability" heading="10. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, AgriSense and its team shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of profits,
          crops, revenue, or data, arising from your use of the Service.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="termination" heading="11. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if you
          violate these Terms or if we discontinue the Service. Upon termination, provisions that by
          their nature should survive (such as intellectual property, disclaimers, and liability
          limits) will remain in effect.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changes" heading="12. Changes to These Terms">
        <p>
          We may update these Terms from time to time. If we make material changes, we will notify
          you through the Service or by email. Your continued use after changes take effect
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="law" heading="13. Governing Law">
        <p>
          These Terms are governed by the laws of the Republic of Rwanda, without regard to its
          conflict-of-law principles. Any disputes shall be subject to the exclusive jurisdiction of
          the competent courts of Rwanda.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" heading="14. Contact Us">
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a
            href="mailto:irasubizasalyneslon@gmail.com"
            className="font-medium text-[#2C6E49] hover:underline"
          >
            irasubizasalyneslon@gmail.com
          </a>{" "}
          or by post at 123 RCA-CORE, Nyabihu, Rwanda.
        </p>
      </LegalSectionBlock>
    </LegalLayout>
  );
};

export default TermsOfService;
