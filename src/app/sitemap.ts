import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/lib/projects-data";
import { courses } from "@/lib/courses-data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://malsharbaji.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const projectEntries = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const courseEntries = courses.map((course) => ({
    url: `${siteUrl}/courses/${course.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/projects`, lastModified: new Date() },
    { url: `${siteUrl}/courses`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...blogEntries,
    ...projectEntries,
    ...courseEntries,
  ];
}
