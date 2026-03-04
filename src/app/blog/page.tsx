import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import BlogContent from "@/components/BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on platform engineering, cloud infrastructure, and DevOps.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogContent posts={posts} />;
}
