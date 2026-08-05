import { Link } from "react-router-dom";
import LegalLayout, { LegalSectionBlock } from "./LegalLayout";

const sections = [
  { id: "intro", heading: "1. Introduction" },
  { id: "collect", heading: "2. Information We Collect" },
  { id: "use", heading: "3. How We Use Information" },
  { id: "legal-basis", heading: "4. Legal Basis" },
  { id: "sharing", heading: "5. How We Share Information" },
  { id: "third-party", heading: "6. Third-Party Services" },
  { id: "security", heading: "7. Data Security" },
  { id: "retention", heading: "8. Data Retention" },
  { id: "rights", heading: "9. Your Rights" },
  { id: "cookies", heading: "10. Cookies & Local Storage" },
  { id: "children", heading: "11. Children's Privacy" },
  { id: "changes", heading: "12. Changes to This Policy" },
  { id: "contact", heading: "13. Contact Us" },
];

const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="August 3, 2026"
      intro="This Privacy Policy explains how AgriSense collects, uses, shares, and protects your personal information when you use our platform."
      sections={sections}
    >
      <LegalSectionBlock id="intro" heading="1. Introduction">
        <p>
          AgriSense ("we", "us", "our") is committed to protecting your privacy. This policy applies
          to information we process when you use our website, dashboards, and services. By using
          AgriSense, you agree to the practices described here and in our{" "}
          <Link to="/legal/terms" className="font-medium text-[#2C6E49] hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="collect" heading="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong>Account information:</strong> username, email address, phone number, password
            (stored in hashed form), and profile image.
          </li>
          <li>
            <strong>Farm & agricultural data:</strong> farm names, locations, size, soil type, crops,
            and prediction inputs you provide.
          </li>
          <li>
            <strong>User content:</strong> community posts, comments, and images you submit.
          </li>
          <li>
            <strong>Location data:</strong> approximate or precise location (only with your
            permission) to provide localized weather and recommendations.
          </li>
          <li>
            <strong>Usage & device data:</strong> log data, browser type, and interactions used to
            operate and improve the Service.
          </li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock id="use" heading="3. How We Use Information">
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Provide, maintain, and improve the Service and its recommendations.</li>
          <li>Authenticate you and secure your account.</li>
          <li>Deliver localized weather, crop, and market insights.</li>
          <li>Communicate with you about updates, security, and support.</li>
          <li>Monitor for fraud, abuse, and violations of our Terms.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock id="legal-basis" heading="4. Legal Basis">
        <p>
          Where applicable law requires, we process your information on the basis of your consent,
          the performance of our contract with you, our legitimate interests in operating the
          Service, and compliance with legal obligations.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="sharing" heading="5. How We Share Information">
        <p>We do not sell your personal information. We may share it with:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong>Service providers</strong> who help us operate the platform (e.g. hosting,
            analytics), under confidentiality obligations.
          </li>
          <li>
            <strong>Other users</strong>, where you choose to post content publicly in the community.
          </li>
          <li>
            <strong>Authorities</strong>, where required by law or to protect rights and safety.
          </li>
          <li>
            <strong>A successor entity</strong> in connection with a merger, acquisition, or asset
            sale.
          </li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock id="third-party" heading="6. Third-Party Services">
        <p>
          We use third-party providers for weather and geocoding data. When you search for a location
          or enable geolocation, coordinates may be sent to these providers to return weather
          information. Their handling of data is governed by their own privacy policies.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="security" heading="7. Data Security">
        <p>
          We implement technical and organizational measures to protect your information, including
          encrypted transport (HTTPS), hashed passwords, and short-lived access tokens with secure
          refresh handling. However, no method of transmission or storage is completely secure, and
          we cannot guarantee absolute security.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="retention" heading="8. Data Retention">
        <p>
          We retain your information for as long as your account is active or as needed to provide
          the Service, comply with legal obligations, resolve disputes, and enforce our agreements.
          You may request deletion of your account and associated data at any time.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="rights" heading="9. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Access, correct, or update your personal information.</li>
          <li>Request deletion of your data.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>Request a copy of your data in a portable format.</li>
        </ul>
        <p>
          To exercise these rights, contact us using the details below. You can manage much of your
          profile directly in your account settings.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="cookies" heading="10. Cookies & Local Storage">
        <p>
          We use browser storage (such as local and session storage) to keep you signed in, remember
          preferences, and operate core features. You can clear this data through your browser, but
          some features may not function properly without it.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="children" heading="11. Children's Privacy">
        <p>
          The Service is not directed to children under 18, and we do not knowingly collect their
          personal information. If you believe a child has provided us data, please contact us so we
          can remove it.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changes" heading="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. We will post the updated version with a new
          "Last updated" date and, for material changes, provide additional notice through the Service
          or by email.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" heading="13. Contact Us">
        <p>
          For privacy questions or requests, contact us at{" "}
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

export default PrivacyPolicy;
