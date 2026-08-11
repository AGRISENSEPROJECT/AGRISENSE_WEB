import { CONTACT } from "@/lib/contact";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";

export const SITE_URL = "https://agrisense.rw";
export const SITE_NAME = "AgriSense";
export const SITE_DEFAULT_TITLE =
  "AgriSense Rwanda | AI Smart Farming, Soil Analysis & Weather";
export const SITE_DEFAULT_DESCRIPTION =
  "AgriSense is Rwanda’s smart farming platform: AI soil analysis, live farm weather, crop recommendations, and a farmer–supplier marketplace. Built in Nyabihu for farmers, co-ops, NGOs, and government.";
export const SITE_OG_IMAGE = `${SITE_URL}/assets/about-us-team.png`;
export const SITE_LOGO = `${SITE_URL}/assets/logo.png`;
export const SITE_KEYWORDS =
  "AgriSense, AgriSense Rwanda, smart farming Rwanda, AI agriculture Rwanda, soil analysis, crop recommendations, farm weather Rwanda, farmer marketplace, ubuhinzi, Nyabihu";

export const SEO_FAQS = [
  {
    question: "What is AgriSense?",
    answer:
      "AgriSense is a smart farming platform for Rwanda. It helps farmers use soil data, live weather, crop recommendations, and a marketplace in one dashboard.",
  },
  {
    question: "Is AgriSense free for farmers?",
    answer:
      "Yes. Starter is free forever and includes one farm profile, basic soil and crop tools, a 3-day weather outlook, and community access. Pro adds more farms and deeper AI insights.",
  },
  {
    question: "Where does AgriSense operate?",
    answer:
      "AgriSense is based in Nyabihu, Rwanda, and serves farmers, suppliers, NGOs, and government programmes across the country.",
  },
  {
    question: "How do I start using AgriSense?",
    answer:
      "Create a free account at agrisense.rw, add your farm, and open soil, weather, and marketplace tools from the farmer dashboard.",
  },
];

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}

const PUBLIC_PAGES: Record<string, Omit<SeoMeta, "path">> = {
  "/": {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    keywords: SITE_KEYWORDS,
  },
  "/about": {
    title: "About AgriSense | Smart Agriculture Team in Rwanda",
    description:
      "AgriSense was built in Rwanda to give farmers clearer soil, weather, and market decisions. Meet the team in Nyabihu connecting AI with African agriculture.",
    keywords: "about AgriSense, AgriSense team Rwanda, smart agriculture Nyabihu",
  },
  "/services": {
    title: "Smart Farming Services in Rwanda | Soil, Weather, Marketplace",
    description:
      "AgriSense services for Rwandan farms: soil and crop analysis, weather and climate alerts, farm management, supplier pricing, and a farmer marketplace.",
    keywords: "farm services Rwanda, soil analysis, farm weather, farmer marketplace",
  },
  "/blog": {
    title: "Smart Farming Blog Rwanda | Soil, Weather & Irrigation",
    description:
      "Guides for Rwandan growers: soil fertility, weather and yields, and irrigation that saves water. Written for real fields, not theory.",
    keywords: "smart farming blog Rwanda, soil fertility, irrigation, farm weather",
  },
  "/contact": {
    title: "Contact AgriSense | Nyabihu, Rwanda (+250 798 963 223)",
    description:
      "Contact AgriSense in Nyabihu, Rwanda. Email agrisense8@gmail.com or call +250 798 963 223 for farmers, partners, NGOs, and enterprise programmes.",
    keywords: "contact AgriSense, Nyabihu, AgriSense phone, agrisense8@gmail.com",
  },
  "/legal/terms": {
    title: "Terms of Service | AgriSense Rwanda",
    description: "Terms that govern use of the AgriSense smart farming platform at agrisense.rw.",
  },
  "/legal/privacy": {
    title: "Privacy Policy | AgriSense Rwanda",
    description:
      "How AgriSense collects and protects farmer, supplier, and partner data on agrisense.rw.",
  },
};

const PRIVATE_PREFIXES = ["/app", "/admin", "/supplier", "/ngo", "/auth", "/testCharts"];

export function canonicalUrl(path: string) {
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${SITE_URL}${clean}`;
}

export function getSeoForPath(pathname: string): SeoMeta {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";

  if (path.startsWith("/blog/") && path !== "/blog") {
    const slug = path.slice("/blog/".length);
    const post = getBlogPost(slug);
    if (post) {
      return {
        title: `${post.title} | AgriSense Blog`,
        description: post.description,
        path,
        image: `${SITE_URL}${post.image}`,
        keywords: post.keywords,
        type: "article",
        publishedTime: post.date,
      };
    }
    return {
      title: "Article not found | AgriSense",
      description: SITE_DEFAULT_DESCRIPTION,
      path,
      noIndex: true,
    };
  }

  const publicPage = PUBLIC_PAGES[path];
  if (publicPage) {
    return {
      ...publicPage,
      path,
      image: publicPage.image || SITE_OG_IMAGE,
      keywords: publicPage.keywords || SITE_KEYWORDS,
      type: "website",
    };
  }

  const isPrivate = PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (isPrivate) {
    return {
      title: `${SITE_NAME} | Account`,
      description: SITE_DEFAULT_DESCRIPTION,
      path,
      image: SITE_OG_IMAGE,
      noIndex: true,
    };
  }

  return {
    title: "Page not found | AgriSense",
    description: SITE_DEFAULT_DESCRIPTION,
    path,
    image: SITE_OG_IMAGE,
    noIndex: true,
  };
}

function breadcrumbList(path: string) {
  const crumbs: { name: string; item: string }[] = [{ name: "Home", item: `${SITE_URL}/` }];
  if (path === "/") return crumbs;
  if (path.startsWith("/blog")) crumbs.push({ name: "Blog", item: `${SITE_URL}/blog` });
  if (path === "/about") crumbs.push({ name: "About", item: `${SITE_URL}/about` });
  if (path === "/services") crumbs.push({ name: "Services", item: `${SITE_URL}/services` });
  if (path === "/contact") crumbs.push({ name: "Contact", item: `${SITE_URL}/contact` });
  if (path === "/legal/terms") crumbs.push({ name: "Terms", item: `${SITE_URL}/legal/terms` });
  if (path === "/legal/privacy") crumbs.push({ name: "Privacy", item: `${SITE_URL}/legal/privacy` });
  if (path.startsWith("/blog/") && path !== "/blog") {
    const post = getBlogPost(path.slice("/blog/".length));
    if (post) crumbs.push({ name: post.title, item: canonicalUrl(path) });
  }
  return crumbs;
}

export function buildJsonLd(pathname: string) {
  const seo = getSeoForPath(pathname);
  const crumbs = breadcrumbList(seo.path);

  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: "AgriSense",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO,
      },
      image: SITE_OG_IMAGE,
      email: CONTACT.email,
      telephone: CONTACT.phoneTel,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nyabihu",
        addressCountry: "RW",
      },
      areaServed: { "@type": "Country", name: "Rwanda" },
      sameAs: [CONTACT.social.linkedin, CONTACT.social.youtube, CONTACT.social.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DEFAULT_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: SITE_DEFAULT_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "RWF" },
      areaServed: { "@type": "Country", name: "Rwanda" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    },
  ];

  if (seo.path === "/") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: SEO_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  if (seo.type === "article") {
    const slug = seo.path.replace("/blog/", "");
    const post = getBlogPost(slug);
    if (post) {
      graph.push({
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}${post.image}`,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: canonicalUrl(seo.path),
        inLanguage: "en",
      });
    }
  }

  if (seo.path === "/blog") {
    graph.push({
      "@type": "Blog",
      name: "AgriSense Smart Farming Blog",
      url: `${SITE_URL}/blog`,
      blogPost: BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        datePublished: post.date,
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
