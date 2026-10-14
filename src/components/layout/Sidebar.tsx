"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-zinc-900 p-4 text-white">
      <h2 className="mb-8 text-2xl font-bold">
        Admin CMS
      </h2>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">Dashboard</Link>

        <Link href="/projects">Proyectos</Link>

        <Link href="/certificates">Certificados</Link>

        <Link href="/experience">Experiencia</Link>

        <Link href="/recommendations">
          Recomendaciones
        </Link>

        <Link href="/settings">Ajustes</Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto rounded bg-red-600 p-2"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}