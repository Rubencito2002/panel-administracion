import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Journey } from "@/types/journey";

const journeyCollection = collection( db, "journey");

export const getJourney = async (): Promise<Journey[]> => {
  const snapshot = await getDocs(journeyCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Journey[];
};

export const createJourney = async (journey: Journey) => {
  return await addDoc(
    journeyCollection,
    journey
  );
};

export const updateJourney = async (journeyId: string, journeyData: Partial<Journey>) => {
  const journeyRef = doc(db, "journey", journeyId);

  await updateDoc( journeyRef, journeyData);
};

export const deleteJourney = async (journeyId: string) => {
  const journeyRef = doc( db, "journey", journeyId);

  await deleteDoc(journeyRef);
};