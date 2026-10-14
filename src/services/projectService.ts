import { addDoc, collection, getDocs, } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/types/project";

const projectsCollection = collection( db, "projects");

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs( projectsCollection );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
};

export const createProject = async (
  project: Project ) => { return await addDoc(projectsCollection, project);
};