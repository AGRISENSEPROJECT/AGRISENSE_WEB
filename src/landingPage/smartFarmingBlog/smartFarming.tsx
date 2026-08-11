import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/lib/blog";

const SmartFarming = () => {
  return (
    <section className="mx-auto mb-20 mt-16 flex max-w-6xl flex-col items-center px-4 md:px-6">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">Smart farming blog</h2>
      <p className="mb-12 max-w-2xl text-center text-gray-600">
        Field notes for Rwanda: soil, weather, and water — so you plant and irrigate with a plan.
      </p>
      <div className="grid w-full gap-8 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="group block">
              <img
                className="h-40 w-full rounded-lg object-cover"
                src={post.image}
                alt={post.title}
                loading="lazy"
              />
              <h3 className="mt-4 text-lg font-semibold text-[#0a7c42] group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
      <Link
        to="/blog"
        className="mt-10 rounded-md bg-[#0a7c42] px-8 py-2 font-medium text-white hover:bg-[#086835]"
      >
        All articles
      </Link>
    </section>
  );
};

export default SmartFarming;
