import { Timestamp } from "firebase/firestore";

export type ProjectType = | "Frontend" | "Backend" | "FullStack";
export type ProjectTag = | "Personal" | "Académico" | "Prácticas" | "Trabajo" | "OpenSource" | "Portfolio" | "Cliente";

export interface Project {
  id?: string;
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  type: ProjectType;
  tags?: ProjectTag[];
  github: string;
  demo?: string;
  imageUrl?: string;
  year: string;
  featured: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}