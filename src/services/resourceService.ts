import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resource } from "@/types/resource";

const resourcesCollection = collection(db, "resources");

export const getResources = async (): Promise<Resource[]> => {
  const snapshot = await getDocs(resourcesCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Resource[];
};

export const createResource = async (resource: Resource) => {
  return await addDoc(
    resourcesCollection,
    resource
  );
};

export const updateResource = async (resourceId: string, resourceData: Partial<Resource>) => {
  const resourceRef = doc(db, "resources", resourceId);

  await updateDoc( resourceRef, resourceData);
};

export const deleteResource = async (resourceId: string) => {
  const resourceRef = doc( db, "resources", resourceId);

  await deleteDoc(resourceRef);
};