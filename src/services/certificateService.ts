import { addDoc, doc, collection, getDocs, updateDoc, deleteDoc,serverTimestamp, } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Certificate } from "@/types/certificate";

const certificatesCollection = collection( db, "certificates");

export const getCertificates = async (): Promise<Certificate[]> => {
    const snapshot = await getDocs( certificatesCollection);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Certificate[];
};

export const createCertificate = async ( certificate: Certificate ) => {
    return await addDoc(certificatesCollection, {...certificate, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), });
};

export const updateCertificate = async ( certificateId: string, certificateData: Partial<Certificate> ) => {
    const certificateRef = doc( db, "certificates", certificateId);

    await updateDoc( certificateRef, {...certificateData, updatedAt: serverTimestamp(), });
};

export const deleteCertificate = async ( certificateId: string) => {
    const certificateRef = doc( db, "certificates", certificateId);

    await deleteDoc(certificateRef)
};