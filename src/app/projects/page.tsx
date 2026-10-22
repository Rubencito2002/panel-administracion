"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectForm from "@/components/projects/ProjectForm";
import { getProjects, createProject, updateProject, deleteProject, } from "@/services/projectService";
import { Project } from "@/types/project";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      toast.error("Error al cargar los proyectos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())).filter((project) => {
    if (featuredFilter === "featured")
      return project.featured;

    if (featuredFilter === "normal")
      return !project.featured;

    return true;
  }).sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));

  const handleCreateProject = async (project: Project) => {
    try {
      const featuredProjects = projects.filter((p) => p.featured && p.id !== editingProject?.id);

      if (project.featured && featuredProjects.length >= 3) {
        await Swal.fire({
          icon: "warning",
          title: "Límite alcanzado",
          text: "Solo se permiten 3 proyectos destacados.",
          confirmButtonColor: "#f59e0b",
        });

        return;
      }

      if (
        editingProject && editingProject.id
      ) {
        await updateProject(editingProject.id,project);
        toast.success("Proyecto actualizado correctamente")
        setEditingProject(null);
      } else {
        await createProject(project);
        toast.success("Proyecto creado correctamente");
      }

      const updatedProjects = await getProjects();

      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      toast.error("Error al guardar proyecto. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const result = await Swal.fire({title: "¿Eliminar proyecto?", text: "Esta acción no se puede deshacer.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#6b7280", confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",});

    if (!result.isConfirmed) return;

    try {
      await deleteProject(id);

      toast.success("Proyecto eliminado correctamente");

      const updatedProjects = await getProjects();

      setProjects(updatedProjects);

      if (
        editingProject?.id === id
      ) {
        setEditingProject(null);
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      toast.error("Error al guardar proyecto. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold"> Proyectos </h1>
        <div className="mb-6 flex items-center gap-4">
          <input type="text" placeholder="Buscar proyecto..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-black p-3 text-white"/>
        </div>
        <div className="mb-6 flex items-center gap-4">
          <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)} className="rounded-lg border p-2">
              <option value="all">Todos</option>
              <option value="featured"> Destacados </option>
              <option value="normal"> No destacados </option>
            </select>
        </div>

        {editingProject && (
          <div className="mb-4 rounded border border-blue-500 p-4">
            Editando:{" "}
            {editingProject.name}
          </div>
        )}

        <p className="mb-4 text-sm text-gray-500">
          ⭐ Destacados actuales: {
            projects.filter((p) => p.featured).length
          } / 3
        </p>

        <ProjectForm onSubmit={handleCreateProject} initialData={editingProject}/>

        {loading ? (
          <p>Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="rounded-lg border p-6 shadow-sm">

                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.name} className="mb-4 h-48 w-full rounded-lg object-cover"/>
                )}
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {project.name}
                  </h2>

                  {project.featured && (
                    <span className="rounded bg-yellow-500 px-2 py-1 text-sm text-black">
                      Destacado
                    </span>
                  )}
                </div>

                <p className="mt-2 text-gray-600">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies?.map(
                    (tech) => (
                      <span key={tech} className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-sm text-cyan-300">
                        {tech}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-4 space-y-1 text-sm">
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {project.type}
                  </p>

                  <p>
                    <strong>Año:</strong>{" "}
                    {project.year}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    GitHub
                  </a>

                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      Demo
                    </a>
                  )}

                  <button onClick={() => setEditingProject(project)} className="rounded bg-red-600 px-3 py-1 text-white">
                    Editar
                  </button>

                  <button onClick={() => project.id && handleDeleteProject(project.id)} className="rounded bg-red-600 px-3 py-1 text-white">
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