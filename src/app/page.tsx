import { getAllPosts } from "@/lib/blog";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts[0] || null;

  return <HomeContent latestPost={latestPost} />;
}
