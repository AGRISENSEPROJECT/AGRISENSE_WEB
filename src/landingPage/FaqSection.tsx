import { SEO_FAQS } from "@/lib/seo";

const FaqSection = () => {
  return (
    <section id="faq" className="bg-white px-6 py-16 md:px-12 lg:px-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2C6E49]">FAQ</p>
        <h2 id="faq-heading" className="mt-2 text-3xl font-bold text-gray-900">
          Questions farmers ask about AgriSense
        </h2>
        <p className="mt-3 text-gray-600">
          Short answers about smart farming in Rwanda — soil, weather, pricing, and how to start.
        </p>
        <dl className="mt-10 space-y-6">
          {SEO_FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-gray-100 pb-6">
              <dt className="text-lg font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-gray-600 leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FaqSection;
