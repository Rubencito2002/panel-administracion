"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");

      await login(email, password);
      toast.success("Sesión iniciada correctamente");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Panel de Administración
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border p-2"/>

          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border p-2"/>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white">
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}