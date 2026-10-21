import { Timestamp } from "firebase/firestore";

export interface Journey {
  id?: string;
  year: string;
  title: string;
  type: string;
  description: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}