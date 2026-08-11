import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LegalSection {
  id: string;
  heading: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  children: ReactNode;
}

const LegalLayout = ({ title, lastUpdated, intro, sections, children }: LegalLayoutProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="AgriSense" className="h-10 w-auto" />
            <span className="text-lg font-bold">
              <span className="text-[#2C6E49]">AGRI</span>SENSE
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 transition-colors hover:text-[#2C6E49]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0B6E4F] to-[#14532d] text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/70">Last updated: {lastUpdated}</p>
          <p className="mt-4 max-w-2xl text-white/90">{intro}</p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              On this page
            </p>
            <nav className="flex flex-col gap-1.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#2C6E49]"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
          <div className="prose-legal space-y-8">{children}</div>

          <div className="mt-10 border-t pt-6 text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a
              href="mailto:agrisense8@gmail.com"
              className="font-medium text-[#2C6E49] hover:underline"
            >
              agrisense8@gmail.com
            </a>
            .
          </div>
        </article>
      </div>
    </div>
  );
};

/** A titled section used inside LegalLayout content. */
export const LegalSectionBlock = ({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-xl font-bold text-gray-900">{heading}</h2>
    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-gray-600">{children}</div>
  </section>
);

export default LegalLayout;
