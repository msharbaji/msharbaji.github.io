import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import BackLink from "@/components/BackLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://malsharbaji.com";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteUrl}/blog/${slug}`,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Mohamad Alsharbaji",
    },
    url: `${siteUrl}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-20">
        <BackLink href="/blog" label="backToBlog" />

        <header className="mb-10">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted">
            <time>{post.date}</time>
            <span className="h-px w-4 bg-border" />
            <span>{post.readingTime} min read</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="section-divider mb-10" />

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
