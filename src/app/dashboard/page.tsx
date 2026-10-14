import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="p-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
      </main>
    </ProtectedRoute>
  );
}