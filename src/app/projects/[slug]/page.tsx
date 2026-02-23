import { Metadata } from "next";
import { projects, getProjectBySlug } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import ProjectDetail from "./ProjectDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title.en,
    description: project.description.en,
    alternates: {
      canonical: `${SITE_URL}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Projects", "projects", project.title.en, slug)} />
      <ProjectDetail project={project} />
    </>
  );
}
