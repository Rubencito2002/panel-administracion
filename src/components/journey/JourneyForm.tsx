"use client";

import { useEffect, useState } from "react";
import { Journey } from "@/types/journey";

interface JourneyFormProps {
  onSubmit: (
    data: Journey
  ) => Promise<void>;

  initialData?: Journey | null;
}

export default function JourneyForm({
  onSubmit,
  initialData,
}: JourneyFormProps) {
  const [year, setYear] = useState("");
  const [title, settitle] = useState("");
  const [type, setType] = useState("Educación");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setYear(initialData.year);
      settitle(initialData.title);
      setType(initialData.type);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit({
      ...(initialData?.id && {
        id: initialData.id,
      }),

      year,
      title,
      type,
      description,
    });

    if (!initialData) {
      setYear("");
      settitle("");
      setType("Educación");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border p-4">
      <h2 className="text-xl font-bold">
        {initialData
          ? "Editar Recorrido"
          : "Nuevo Recorrido"}
      </h2>

      <input className="w-full rounded border p-2" placeholder="Año o periodo" value={year} onChange={(e) => setYear(e.target.value)}/>

      <input className="w-full rounded border p-2" placeholder="Título" value={title} onChange={(e) => settitle(e.target.value)}/>

      <select className="w-full rounded border p-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Educación">
          Educación
        </option>
        <option value="Prácticas">
          Prácticas
        </option>
        <option value="Formación">
          Formación
        </option>
        <option value="Objetivo">
          Objetivo
        </option>
      </select>

      <textarea className="w-full rounded border p-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}/>

      <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
        {initialData
          ? "Actualizar Recorrido"
          : "Guardar Recorrido"}
      </button>
    </form>
  );
}