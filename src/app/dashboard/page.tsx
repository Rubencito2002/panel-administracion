"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProjects } from "@/services/projectService";
import { getCertificates } from "@/services/certificateService";
import { getJourney } from "@/services/journeyService";
import { getResources } from "@/services/resourceService";
import Link from "next/link";

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
  const [topTechnology, setTopTechnology] = useState("-");
  const [topTechnologyCount, setTopTechnologyCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topTag, setTopTag] = useState("-");
  const [topTagCount, setTopTagCount] = useState(0);
  const [projectTypes, setProjectTypes] = useState({ frontend: 0, backend: 0, fullStack: 0, });

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

        const activity = [
          ...projects.map((project) => ({
            type: "Proyecto",
            name: project.name,
            updatedAt: project.updatedAt,
            icon: "📁",
          })),

          ...certificates.map((certificate) => ({
            type: "Certificado",
            name: certificate.name,
            updatedAt: certificate.updatedAt,
            icon: "🎓",
          })),

          ...journey.map((item) => ({
            type: "Recorrido",
            name: item.title,
            updatedAt: item.updatedAt,
            icon: "🧭",
          })),

          ...resources.map((resource) => ({
            type: "Recurso",
            name: resource.title,
            updatedAt: resource.updatedAt,
            icon: "🔗",
          })),
        ].filter((item) => item.updatedAt).sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)).slice(0, 10);

        setRecentActivity(activity);

        const technologyStats: Record<string, number> = {};

        projects.forEach((project) => {
          project.technologies?.forEach((tech) => {
            technologyStats[tech] = (technologyStats[tech] || 0) + 1;
          });
        });

        const mostUsed = Object.entries(technologyStats).sort((a, b) => b[1] - a[1])[0];

        if (mostUsed) {
          setTopTechnology(mostUsed[0]);
          setTopTechnologyCount(mostUsed[1]);
        }

        const tagStats: Record<string, number> = {};

        projects.forEach((project) => {
          project.tags?.forEach((tag) => {
            tagStats[tag] = (tagStats[tag] || 0) + 1;
          });
        });

        const mostUsedTag = Object.entries(tagStats)
          .sort((a, b) => b[1] - a[1])[0];

        if (mostUsedTag) {
          setTopTag(mostUsedTag[0]);
          setTopTagCount(mostUsedTag[1]);
        }

        setProjectTypes({
          frontend: projects.filter((project) => project.type === "Frontend").length,
          backend: projects.filter((project) => project.type === "Backend").length,
          fullStack: projects.filter((project) => project.type === "FullStack").length,
        });
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
                <Link href="/projects" className="mt-4 inline-block rounded bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700">
                  Ir a Proyectos →
                </Link>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Certificados </h2>
                <p className="mt-3 text-4xl font-bold text-green-500"> {stats.certificates} </p>
                <p className="mt-4 text-sm text-gray-500"> Último certificado: </p>
                <p className="font-medium"> {latestCertificate} </p>
                <Link href="/certificates" className="mt-4 inline-block rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700">
                  Ir a Certificados →
                </Link>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Recorrido </h2>
                <p className="mt-3 text-4xl font-bold text-purple-500"> {stats.journey} </p>
                <p className="mt-4 text-sm text-gray-500"> Último elemento: </p>
                <p className="font-medium"> {latestJourney} </p>
                <Link href="/journey" className="mt-4 inline-block rounded bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                  Ir a Recorrido →
                </Link>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Recursos </h2>
                <p className="mt-3 text-4xl font-bold text-orange-500"> {stats.resources} </p>
                <p className="mt-4 text-sm text-gray-500"> Último recurso: </p>
                <p className="font-medium"> {latestResource} </p>
                <Link href="/resources" className="mt-4 inline-block rounded bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700">
                  Ir a Recursos →
                </Link>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <h2 className="text-lg font-semibold"> Proyectos Destacados </h2>
                <p className="mt-3 text-4xl font-bold text-yellow-500"> {featuredProjects} </p>
                <p className="mt-4 text-sm text-gray-500"> Marcados en la Home </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="mt-8 rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4"> 💻 Tecnología Más Utilizada </h2>
                <p className="text-4xl font-bold text-cyan-500"> {topTechnology} </p>
                <p className="mt-2 text-gray-500"> Utilizada en {topTechnologyCount} proyectos </p>
              </div>

              <div className="mt-8 rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4"> 🏷️ Etiqueta Más Utilizada </h2>
                <p className="text-4xl font-bold text-amber-500"> #{topTag} </p>
                <p className="mt-2 text-gray-500"> Utilizada en {topTagCount} proyectos </p>
              </div>

              <div className="mt-8 rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold"> 📊 Distribución de Proyectos </h2>

                <div className="space-y-4">

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Frontend</span>
                      <span>{projectTypes.frontend}</span>
                    </div>

                    <div className="h-3 rounded bg-gray-700">
                      <div className="h-3 rounded bg-cyan-500" style={{width: `${stats.projects > 0 ? (projectTypes.frontend / stats.projects) * 100 : 0}%`,}}/>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Backend</span>
                      <span>{projectTypes.backend}</span>
                    </div>

                    <div className="h-3 rounded bg-gray-700">
                      <div className="h-3 rounded bg-purple-500" style={{width: `${stats.projects > 0 ? (projectTypes.backend / stats.projects) * 100 : 0}%`,}}/>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>FullStack</span>
                      <span>{projectTypes.fullStack}</span>
                    </div>

                    <div className="h-3 rounded bg-gray-700">
                      <div className="h-3 rounded bg-green-500" style={{width: `${stats.projects > 0 ? (projectTypes.fullStack / stats.projects) * 100 : 0}%`,}}/>
                    </div>
                  </div>

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
            </div>
            
            <div className="mt-8 rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4"> Actividad Reciente </h2>
              <div className="space-y-3">
                {recentActivity.map(
                  (activity, index) => (
                    <div key={index} className="rounded border p-3">
                      <div className="font-medium">
                        {activity.icon} {activity.type}
                      </div>
                      <div className="text-sm">
                        {activity.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.updatedAt
                          ?.toDate()
                          .toLocaleString("es-ES")}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}