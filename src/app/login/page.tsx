export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Panel de Administración
        </h1>

        <form className="space-y-4">
          <input type="email" placeholder="Correo electrónico" className="w-full rounded border p-2"/>

          <input type="password" placeholder="Contraseña" className="w-full rounded border p-2" />

          <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white">
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}