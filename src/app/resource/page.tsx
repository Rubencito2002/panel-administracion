"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ResourceForm from "@/components/resource/ResourceForm";
import { getResources, createResource, updateResource, deleteResource, } from "@/services/resourceService";
import { Resource } from "@/types/resource";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource,] = useState<Resource | null>(null);

  const loadResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSaveResource = async (resource: Resource) => {
      try {
        if (
          editingResource &&
          editingResource.id
        ) {
          await updateResource(
            editingResource.id,
            resource
          );

          setEditingResource(null);
        } else {
          await createResource(
            resource
          );
        }

        const updated = await getResources();

        setResources(updated);
      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteResource = async (id: string) => {
      const confirmed = window.confirm("¿Seguro que deseas eliminar este recurso?");

      if (!confirmed) return;

      await deleteResource(id);

      const updated = await getResources();

      setResources(updated);
    };

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold">
          Recursos
        </h1>

        {editingResource && (
          <div className="mb-4 rounded border border-blue-500 p-4">
            Editando:{" "}
            {editingResource.title}
          </div>
        )}

        <ResourceForm onSubmit={handleSaveResource} initialData={editingResource}/>

        {loading ? (
          <p>Cargando recursos...</p>
        ) : resources.length === 0 ? (
          <p>
            No hay recursos registrados.
          </p>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-bold">
                  {resource.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  {resource.description}
                </p>

                <span className="mt-3 inline-block rounded bg-blue-600 px-2 py-1 text-sm text-white">
                  {resource.category}
                </span>

                <div className="mt-4 flex flex-wrap gap-4">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    Visitar Recurso
                  </a>

                  <button onClick={() => setEditingResource(resource)} className="rounded bg-blue-600 px-3 py-1 text-white">
                    Editar
                  </button>

                  <button onClick={() => resource.id && handleDeleteResource(resource.id)}className="rounded bg-red-600 px-3 py-1 text-white">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}