"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import JourneyForm from "@/components/journey/JourneyForm";
import { getJourney, createJourney, updateJourney, deleteJourney, } from "@/services/journeyService";
import { Journey } from "@/types/journey";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function JourneyPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJourney, setEditingJourney, ] = useState<Journey | null>(null);
  const [search, setSearch] = useState("");

  const loadJourney = async () => {
    try {
      const data = await getJourney();
      setJourneys(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los elementos del recorrido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const filteredJourneys = journeys.filter((journey) => journey.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));

  const handleSaveJourney = async (journey: Journey) => {
      try {
        if (
          editingJourney && editingJourney.id
        ) {
          await updateJourney(editingJourney.id,journey);
          toast.success("Recorrido actualizado correctamente");
          setEditingJourney(null);
        } else {
          await createJourney(journey);
          toast.success("Recorrido creado correctamente");
        }

        const updated = await getJourney();

        setJourneys(updated);
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar el recorrido. Por favor, inténtalo de nuevo.");
      }
    };

  const handleDeleteJourney = async (id: string) => {
      const result = await Swal.fire({title: "¿Eliminar proyecto?", text: "Esta acción no se puede deshacer.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#6b7280", confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",});

      if (!result.isConfirmed) return;

      await deleteJourney(id);

      const updated = await getJourney();

      setJourneys(updated);
    };

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold"> Recorrido </h1>

        <div className="mb-6">
          <input type="text" placeholder="Buscar proyecto..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-black p-3 text-white"/>
        </div>

        {editingJourney && (
          <div className="mb-4 rounded border border-blue-500 p-4">
            Editando:{" "}
            {editingJourney.title}
          </div>
        )}

        <JourneyForm onSubmit={handleSaveJourney} initialData={editingJourney}/>

        {loading ? (
          <p> Cargando... </p>
        ) : (
          <div className="space-y-4">
            {filteredJourneys.map((journey) => (
              <div key={journey.id} className="rounded-lg border p-4 shadow-sm">
                <p className="font-bold">
                  {journey.year}
                </p>

                <h2 className="text-xl font-bold">
                  {journey.title}
                </h2>

                <span className="inline-block rounded bg-blue-600 px-2 py-1 text-sm text-white">
                  {journey.type}
                </span>

                <p className="mt-3">
                  {journey.description}
                </p>

                <p className="mt-3">
                  Orden: {journey.order}
                </p>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => setEditingJourney( journey)} className="rounded bg-blue-600 px-3 py-1 text-white">
                    Editar
                  </button>

                  <button onClick={() => journey.id && handleDeleteJourney(journey.id)} className="rounded bg-red-600 px-3 py-1 text-white">
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