"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProjects } from "@/services/projectService";
import { getCertificates } from "@/services/certificateService";
import { getJourney } from "@/services/journeyService";
import { getResources } from "@/services/resourceService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    journey: 0,
    resources: 0,
  });

  const [latestProject, setLatestProject] = useState("");
  const [latestCertificate, setLatestCertificate] = useState("");
  const [latestJourney, setLatestJourney] = useState("");
  const [latestResource, setLatestResource] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {const loadStats = async () => {
      try {
        const [projects, certificates, journey, resources, ] = await Promise.all([getProjects(), getCertificates(), getJourney(), getResources(),]);

        setStats({
          projects: projects.length,
          certificates: certificates.length,
          journey: journey.length,
          resources: resources.length,
        });
        setLatestProject(
          projects[projects.length - 1]?.name || "-"
        );

        setLatestCertificate(
          certificates[certificates.length - 1]?.name || "-"
        );

        setLatestJourney(
          journey[journey.length - 1]?.title || "-"
        );

        setLatestResource(
          resources[resources.length - 1]?.title || "-"
        );
        setFeaturedProjects(
          projects.filter(
            (project) => project.featured
          ).length
        );
      } catch (error) {
        console.error(
          "Error cargando estadísticas:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-8 text-3xl font-bold">
          Dashboard
        </h1>

        {loading ? (
          <p>Cargando estadísticas...</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Proyectos </h2>
                <p className="mt-3 text-4xl font-bold text-cyan-500"> {stats.projects} </p>
                <p className="mt-4 text-sm text-gray-500"> Último proyecto: </p>
                <p className="font-medium"> {latestProject} </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Certificados </h2>
                <p className="mt-3 text-4xl font-bold text-green-500"> {stats.certificates} </p>
                <p className="mt-4 text-sm text-gray-500"> Último certificado: </p>
                <p className="font-medium"> {latestCertificate} </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Recorrido </h2>
                <p className="mt-3 text-4xl font-bold text-purple-500"> {stats.journey} </p>
                <p className="mt-4 text-sm text-gray-500"> Último elemento: </p>
                <p className="font-medium"> {latestJourney} </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Recursos </h2>
                <p className="mt-3 text-4xl font-bold text-orange-500"> {stats.resources} </p>
                <p className="mt-4 text-sm text-gray-500"> Último recurso: </p>
                <p className="font-medium"> {latestResource} </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Proyectos Destacados </h2>
                <p className="mt-3 text-4xl font-bold text-yellow-500"> {featuredProjects} </p>
                <p className="mt-4 text-sm text-gray-500"> Marcados en la Home </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4"> Resumen General </h2>
              <p> Este CMS gestiona actualmente: </p>
              <ul className="mt-3 space-y-2">
                <li> 📁 {stats.projects} proyectos </li>
                <li> 🎓 {stats.certificates} certificados </li>
                <li> 🧭 {stats.journey} elementos de recorrido </li>
                <li> 🔗 {stats.resources} recursos </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}