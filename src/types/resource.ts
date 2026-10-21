import { Timestamp } from "firebase/firestore";

export interface Resource {
  id?: string;
  title: string;
  description: string;
  category: string;
  url: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}