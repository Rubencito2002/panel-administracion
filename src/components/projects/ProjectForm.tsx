"use client";

import { useEffect, useState } from "react";
import { Project, ProjectTag, ProjectType} from "@/types/project";
import { generateSlug } from "@/utils/generateSlug";

interface ProjectFormProps {
  onSubmit: (data: Project) => Promise<void>;
  initialData?: Project | null;
}

export default function ProjectForm({onSubmit, initialData, }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [type, setType] = useState<ProjectType>("Frontend");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [year, setYear] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState<ProjectTag[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const availableTags: ProjectTag[] = [
    "Personal",
    "Académico",
    "Prácticas",
    "Trabajo",
    "OpenSource",
    "Portfolio",
    "Cliente",
  ];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setTechnologies(initialData.technologies.join(", "));
      setType(initialData.type);
      setGithub(initialData.github);
      setDemo(initialData.demo || "");
      setYear(initialData.year);
      setFeatured(initialData.featured);
      setImageUrl(initialData.imageUrl || "");
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  const uploadImage = async () => {
    if (!imageFile) return imageUrl;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        imageFile
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
        "Error subiendo imagen",
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

    const uploadedImageUrl = await uploadImage();
    const slug = generateSlug(name);

    await onSubmit({
      ...(initialData?.id && {
        id: initialData.id,
      }),
      slug,
      name,
      description,
      technologies: technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      tags,
      type,
      github,
      demo,
      year,
      featured,
      imageUrl:
        uploadedImageUrl || imageUrl,
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
      setImageFile(null);
      setImageUrl("");
      setTags([]);
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

      <div>
        <label className="mb-2 block">
          Etiquetas
        </label>

        <div className="flex flex-wrap gap-3">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input type="checkbox" checked={tags.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTags([...tags, tag]);
                  } else {
                    setTags(tags.filter((t) => t !== tag));
                  }
                }}/>
              {tag}
            </label>
          ))}
        </div>
      </div>

      <select className="w-full rounded border p-2" value={type} onChange={(e) => setType(e.target.value as ProjectType)}>
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

      <div>
        <label className="mb-2 block">
          Imagen del proyecto
        </label>

        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}/>
      </div>

      {imageUrl && (
        <img src={imageUrl} alt={name} className="h-40 rounded border object-cover"/>
      )}

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}/>
        <span>Destacado</span>
      </label>

      <button type="submit" disabled={uploading} className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50">
        {uploading
          ? "Subiendo imagen..."
          : initialData
          ? "Actualizar Proyecto"
          : "Guardar Proyecto"}
      </button>
    </form>
  );
}