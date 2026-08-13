import { Link, Navigate, useParams } from "react-router-dom";
import PublicLayout from "../PublicLayout";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog";
import { routes } from "@/lib/routes";

const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const post = getBlogPost(slug);

  if (!post) {
    return <Navigate to={routes.blog} replace />;
  }

  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug);

  return (
    <PublicLayout title={post.title}>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link to={routes.home} className="hover:text-[#2C6E49]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to={routes.blog} className="hover:text-[#2C6E49]">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-gray-800">{post.title}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <p className="text-sm font-medium text-[#2C6E49]">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {" · AgriSense Rwanda"}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{post.description}</p>
        </header>

        <img
          src={post.image}
          alt={post.title}
          className="mt-8 w-full rounded-2xl object-cover"
          width={1200}
          height={675}
        />

        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-gray-700">
          {post.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl bg-[#f0f7f4] p-6">
          <h2 className="text-lg font-bold text-gray-900">More from the blog</h2>
          <ul className="mt-3 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/blog/${item.slug}`}
                  className="font-medium text-[#2C6E49] hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>
    </PublicLayout>
  );
};

export default BlogPostPage;
