"use client";

import { useEffect, useState } from "react";
import { Certificate } from "@/types/certificate";

interface CertificateFormProps {
  onSubmit: (
    data: Certificate
  ) => Promise<void>;

  initialData?: Certificate | null;
}

export default function CertificateForm({
  onSubmit,
  initialData,
}: CertificateFormProps) {
  const [name, setname] = useState("");
  const [year, setYear] = useState("");
  const [institution, setInstitution] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [link, setLink] = useState("");

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    if (initialData) {
      setname(initialData.name);
      setYear(initialData.year || "");
      setInstitution(
        initialData.institution
      );
      setCategory(
        initialData.category
      );
      setDescription(
        initialData.description
      );
      setLink(initialData.link || "");

      setPdfUrl(
        initialData.pdfUrl || ""
      );
    }
  }, [initialData]);

  const uploadPdf = async () => {
    if (!pdfFile) return pdfUrl;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        pdfFile
      );

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      return data.url;
    } catch (error) {
      console.error(
        "Error subiendo PDF:",
        error
      );

      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const uploadedPdfUrl =
      await uploadPdf();

    await onSubmit({
      ...(initialData?.id && {
        id: initialData.id,
      }),

      name,
      year,
      institution,
      category,
      description,
      link,

      pdfUrl:
        uploadedPdfUrl || pdfUrl,
    });

    if (!initialData) {
      setname("");
      setYear("");
      setInstitution("");
      setCategory("");
      setDescription("");
      setLink("");

      setPdfFile(null);
      setPdfUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border p-4">
      <h2 className="text-xl font-bold">
        {initialData
          ? "Editar Certificado"
          : "Nuevo Certificado"}
      </h2>

      <input className="w-full rounded border p-2" placeholder="Título" value={name} onChange={(e) => setname(e.target.value) }/>
      <input className="w-full rounded border p-2" placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)}/>
      <input className="w-full rounded border p-2" placeholder="Institución" value={institution} onChange={(e) => setInstitution(e.target.value)}/>
      <input className="w-full rounded border p-2" placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)}/>

      <textarea className="w-full rounded border p-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}/>

      <input className="w-full rounded border p-2" placeholder="Enlace certificado (OpenWebinars)" value={link} onChange={(e) => setLink(e.target.value)}/>

      <div>
        <label className="mb-2 block">
          PDF certificado
        </label>

        <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)}/>
      </div>

      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Ver PDF actual
        </a>
      )}

      <button type="submit" disabled={uploading} className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50">
        {uploading
          ? "Subiendo PDF..."
          : initialData
          ? "Actualizar Certificado"
          : "Guardar Certificado"}
      </button>
    </form>
  );
}
