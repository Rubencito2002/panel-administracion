"use client";

import { useEffect, useState } from "react";
import { Resource } from "@/types/resource";

interface ResourceFormProps {
  onSubmit: (data: Resource) => Promise<void>;
  initialData?: Resource | null;
}

export default function ResourceForm({onSubmit, initialData,}: ResourceFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Herramienta");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setUrl(initialData.url);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      ...(initialData?.id && {
        id: initialData.id,
      }),

      title,
      description,
      category,
      url,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setCategory("Herramienta");
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border p-4">
      <h2 className="text-xl font-bold">
        {initialData
          ? "Editar Recurso"
          : "Nuevo Recurso"}
      </h2>

      <input className="w-full rounded border p-2" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)}/>

      <textarea className="w-full rounded border p-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}/>

      <select className="w-full rounded border p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Herramienta">
          Herramienta
        </option>
        <option value="Tutorial">
          Tutorial
        </option>
        <option value="Documentación">
          Documentación
        </option>
        <option value="Recurso">
          Recurso
        </option>
      </select>

      <input className="w-full rounded border p-2" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)}/>

      <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
        {initialData
          ? "Actualizar Recurso"
          : "Guardar Recurso"}
      </button>
    </form>
  );
}