import { addDoc, doc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
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

export const updateProject = async ( projectId: string, projectData: Partial<Project> ) => {
  const projectRef = doc( db, "projects", projectId );

  await updateDoc( projectRef, projectData );
};

export const deleteProject = async ( projectId: string ) => {
  const projectRef = doc( db, "projects", projectId );

  await deleteDoc(projectRef);
};