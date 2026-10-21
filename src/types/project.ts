import { Timestamp } from "firebase/firestore";

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  type:
    | "Frontend"
    | "Backend"
    | "FullStack";
  github: string;
  demo?: string;
  imageUrl?: string;
  year: string;
  featured: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}