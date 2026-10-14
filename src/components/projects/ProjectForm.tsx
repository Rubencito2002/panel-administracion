"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (data: Project) => Promise<void>;
  initialData?: Project | null;
}

export default function ProjectForm({
  onSubmit,
  initialData,
}: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [type, setType] = useState("Frontend");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [year, setYear] = useState("");
  const [featured, setFeatured] =
    useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setTechnologies(
        initialData.technologies.join(", ")
      );
      setType(initialData.type);
      setGithub(initialData.github);
      setDemo(initialData.demo || "");
      setYear(initialData.year);
      setFeatured(initialData.featured);
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
      name,
      description,
      technologies: technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      type,
      github,
      demo,
      year,
      featured,
    } as Project);

    if (!initialData) {
      setName("");
      setDescription("");
      setTechnologies("");
      setType("Frontend");
      setGithub("");
      setDemo("");
      setYear("");
      setFeatured(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border p-4">
      <h2 className="text-xl font-bold">
        {initialData
          ? "Editar Proyecto"
          : "Nuevo Proyecto"}
      </h2>

      <input className="w-full rounded border p-2" placeholder="Nombre del proyecto" value={name} onChange={(e) => setName(e.target.value)}/>

      <textarea className="w-full rounded border p-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}/>

      <input className="w-full rounded border p-2" placeholder="Tecnologías (React, TypeScript, Firebase)" value={technologies} onChange={(e) => setTechnologies(e.target.value)}/>

      <select className="w-full rounded border p-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Frontend">
          Frontend
        </option>

        <option value="Backend">
          Backend
        </option>

        <option value="FullStack">
          FullStack
        </option>
      </select>

      <input className="w-full rounded border p-2" placeholder="GitHub" value={github} onChange={(e) => setGithub(e.target.value)}/>
      <input className="w-full rounded border p-2" placeholder="Demo" value={demo} onChange={(e) => setDemo(e.target.value)}/>
      <input className="w-full rounded border p-2" placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)}/>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured( e.target.checked )}/>
        <span>Destacado</span>
      </label>

      <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
        {initialData
          ? "Actualizar Proyecto"
          : "Guardar Proyecto"}
      </button>
    </form>
  );
}