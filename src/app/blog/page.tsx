import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogContent from "@/components/BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on platform engineering, cloud infrastructure, and DevOps.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogContent posts={posts} />;
}
