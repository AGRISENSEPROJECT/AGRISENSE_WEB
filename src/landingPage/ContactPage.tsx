import { Mail, MapPin, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import PublicLayout from "./PublicLayout";

interface ContactState {
  plan?: string;
  subject?: string;
}

const ContactPage = () => {
  const location = useLocation();
  const state = (location.state as ContactState | null) ?? {};
  const isEnterprise = state.plan === "enterprise";
  const mailSubject = encodeURIComponent(
    state.subject || (isEnterprise ? "AgriSense Enterprise enquiry" : "Hello from AgriSense website"),
  );

  return (
    <PublicLayout title="Contact">
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#2C6E49]/10 px-4 py-1.5 text-sm font-semibold text-[#2C6E49]">
            Contact
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {isEnterprise ? "Talk to sales" : "Get in touch"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            {isEnterprise
              ? "Interested in Enterprise for your cooperative, NGO, or program? Tell us what you need and we’ll follow up."
              : "Questions about AgriSense, partnerships, or early access? We’d love to hear from you."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <a
            href={`mailto:irasubizasalyneslon@gmail.com?subject=${mailSubject}`}
            className="rounded-2xl border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C6E49]/10 text-[#2C6E49]">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Email</h2>
            <p className="mt-1 text-sm text-gray-500">irasubizasalyneslon@gmail.com</p>
          </a>
          <a
            href="tel:+250798963223"
            className="rounded-2xl border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C6E49]/10 text-[#2C6E49]">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Phone</h2>
            <p className="mt-1 text-sm text-gray-500">+250 798 963 223</p>
          </a>
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C6E49]/10 text-[#2C6E49]">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Location</h2>
            <p className="mt-1 text-sm text-gray-500">Nyabihu, Rwanda</p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-[#f0f7f4] p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">
            {isEnterprise ? "Request an Enterprise quote" : "Prefer email?"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isEnterprise
              ? "Email us with your organization details and we’ll share a tailored plan."
              : "Send us a message and we’ll get back to you as soon as we can."}
          </p>
          <a
            href={`mailto:irasubizasalyneslon@gmail.com?subject=${mailSubject}`}
            className="mt-5 inline-flex rounded-lg bg-[#2C6E49] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#23583a]"
          >
            {isEnterprise ? "Email sales" : "Write to us"}
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;
