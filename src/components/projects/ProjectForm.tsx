"use client";

import { useState } from "react";

interface ProjectFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    github: string;
    demo: string;
    featured: boolean;
  }) => Promise<void>;
}

export default function ProjectForm({
  onSubmit,
}: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [github, setGithub] =
    useState("");

  const [demo, setDemo] = useState("");

  const [featured, setFeatured] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit({
      title,
      description,
      github,
      demo,
      featured,
    });

    setTitle("");
    setDescription("");
    setGithub("");
    setDemo("");
    setFeatured(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border p-4">
      <input className="w-full rounded border p-2" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)}/>

      <textarea className="w-full rounded border p-2" placeholder="Descripción" value={description} onChange={(e) => setDescription( e.target.value)}/>

      <input className="w-full rounded border p-2" placeholder="GitHub" value={github} onChange={(e) => setGithub(e.target.value)}/>

      <input className="w-full rounded border p-2" placeholder="Demo" value={demo} onChange={(e) => setDemo(e.target.value)}/>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}/>
        <span>Destacado</span>
      </label>

      <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
        Guardar Proyecto
      </button>
    </form>
  );
}