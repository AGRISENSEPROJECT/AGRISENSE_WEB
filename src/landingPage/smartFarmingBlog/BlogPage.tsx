import { Link } from "react-router-dom";
import PublicLayout from "../PublicLayout";
import { BLOG_POSTS } from "@/lib/blog";
import { routes } from "@/lib/routes";

const BlogPage = () => (
  <PublicLayout title="Blog">
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to={routes.home} className="hover:text-[#2C6E49]">
          Home
        </Link>
        <span className="px-2">/</span>
        <span className="text-gray-800">Blog</span>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
        Smart farming blog for Rwanda
      </h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        Practical guides on soil fertility, weather, and irrigation — written for farmers using
        AgriSense in the field.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
            <img
              src={post.image}
              alt={post.title}
              className="h-40 w-full object-cover"
              width={640}
              height={320}
            />
            <div className="flex flex-1 flex-col p-5">
              <time className="text-xs font-medium text-[#2C6E49]" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <h2 className="mt-2 text-lg font-bold text-gray-900">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-gray-600">{post.description}</p>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-4 text-sm font-semibold text-[#2C6E49] hover:underline"
              >
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </PublicLayout>
);

export default BlogPage;
