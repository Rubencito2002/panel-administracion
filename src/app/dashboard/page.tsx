"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    router.push("/login");
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}