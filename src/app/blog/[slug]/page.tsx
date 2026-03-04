import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import BlogPostDetail from "./BlogPostDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
    title: post.title.en,
    description: post.description.en,
    openGraph: {
      title: post.title.en,
      description: post.description.en,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${slug}`,
      images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Get series siblings for navigation
  const seriesPosts = post.series
    ? getAllPosts()
        .filter((p) => p.series === post.series)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
        .map((p) => ({ slug: p.slug, title: p.title, seriesOrder: p.seriesOrder }))
    : [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.en,
    description: post.description.en,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Mohamad Alsharbaji",
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Blog", "blog", post.title.en, slug)} />
      <BlogPostDetail post={post} seriesPosts={seriesPosts} />
    </>
  );
}
