"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProjects } from "@/services/projectService";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold">
          Proyectos
        </h1>

        {loading ? (
          <p>Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg border p-4 shadow-sm">
                <h2 className="text-xl font-bold">
                  {project.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  {project.description}
                </p>

                <div className="mt-4 flex gap-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    GitHub
                  </a>

                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    Demo
                  </a>
                </div>

                {project.featured && (
                  <span className="mt-4 inline-block rounded bg-yellow-500 px-2 py-1 text-sm text-black">
                    Destacado
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}