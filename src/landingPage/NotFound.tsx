import { Link } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import { routes } from "@/lib/routes";

const NotFound = () => (
  <PublicLayout title="Page not found">
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#2C6E49]">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-gray-900">This page is not on AgriSense</h1>
      <p className="mt-3 text-gray-600">
        The link may be old or typed incorrectly. Try the home page, services, or blog.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to={routes.home}
          className="rounded-lg bg-[#2C6E49] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#23583a]"
        >
          Back home
        </Link>
        <Link
          to={routes.contact}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Contact us
        </Link>
      </div>
    </section>
  </PublicLayout>
);

export default NotFound;
