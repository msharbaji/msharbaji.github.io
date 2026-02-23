import { Metadata } from "next";
import { courses, getCourseBySlug } from "@/lib/courses-data";
import { notFound } from "next/navigation";
import CourseDetail from "./CourseDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://malsharbaji.com";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};

  return {
    title: course.title.en,
    description: course.description.en,
    alternates: {
      canonical: `${siteUrl}/courses/${slug}`,
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title.en,
    description: course.description.en,
    url: `${siteUrl}/courses/${slug}`,
    provider: {
      "@type": "Person",
      name: "Mohamad Alsharbaji",
      url: siteUrl,
    },
    numberOfLessons: course.topics.length,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `${course.topics.length} lessons`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${siteUrl}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.title.en,
        item: `${siteUrl}/courses/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CourseDetail course={course} />
    </>
  );
}
