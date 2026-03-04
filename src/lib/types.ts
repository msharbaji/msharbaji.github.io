import type { Bilingual } from "./i18n";

export type { Bilingual };

export interface Experience {
  company: string;
  role: Bilingual;
  period: string;
  location: Bilingual;
  bullets: Bilingual<string[]>;
}

export interface Education {
  degree: Bilingual;
  school: Bilingual;
  period: string;
  note: Bilingual;
}

export interface Certification {
  name: Bilingual;
  date: string;
}

export interface SkillGroup {
  category: Bilingual;
  items: string[];
}

export interface Project {
  slug: string;
  title: Bilingual;
  description: Bilingual;
  content: Bilingual;
  tech: string[];
  github?: string;
  live?: string;
}

export interface CourseTopic {
  number: number;
  file: string;
  title: Bilingual;
  description: Bilingual;
  icon: string;
  tag: "theory" | "hands-on" | "project" | "career";
  phase: number;
}

export interface Course {
  slug: string;
  title: Bilingual;
  description: Bilingual;
  topics: CourseTopic[];
}

export interface BlogPost {
  slug: string;
  title: Bilingual;
  date: string;
  description: Bilingual;
  tags: string[];
  content: Bilingual;
  readingTime: number;
  series?: string;
  seriesOrder?: number;
}
