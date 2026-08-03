
import PriceCards from './PriceCards';



const PricingPlan = () => {
  return (
    <section className="py-16 md:py-20 px-6 sm:px-10 lg:px-24 xl:px-40 text-center">
      <div className="mx-auto max-w-2xl">
        <span className="inline-block rounded-full bg-[#2C6E49]/10 px-4 py-1.5 text-sm font-semibold text-[#2C6E49]">
          Pricing
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
          Simple plans that grow with you
        </h1>
        <p className="mt-3 text-gray-600">
          Start free and upgrade when you're ready. Built to be affordable for every farmer,
          cooperative, and institution.
        </p>
      </div>

      <div className="mt-12">
        <PriceCards />
      </div>
    </section>
  );
};

export default PricingPlan;
