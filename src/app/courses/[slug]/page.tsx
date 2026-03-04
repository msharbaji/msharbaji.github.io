import { Metadata } from "next";
import { courses, getCourseBySlug } from "@/lib/courses-data";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import CourseDetail from "./CourseDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
    openGraph: {
      title: course.title.en,
      description: course.description.en,
      type: "website",
      url: `${SITE_URL}/courses/${slug}`,
      images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${SITE_URL}/courses/${slug}`,
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
    url: `${SITE_URL}/courses/${slug}`,
    provider: {
      "@type": "Person",
      name: "Mohamad Alsharbaji",
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: "Mohamad Alsharbaji",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    numberOfLessons: course.topics.length,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `${course.topics.length} lessons`,
    },
  };

  return (
    <>
      <JsonLd data={courseJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Courses", "courses", course.title.en, slug)} />
      <CourseDetail course={course} />
    </>
  );
}
