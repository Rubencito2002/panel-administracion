"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import JourneyForm from "@/components/journey/JourneyForm";
import { getJourney, createJourney, updateJourney, deleteJourney, } from "@/services/journeyService";
import { Journey } from "@/types/journey";

export default function JourneyPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJourney, setEditingJourney, ] = useState<Journey | null>(null);

  const loadJourney = async () => {
    try {
      const data = await getJourney();
      setJourneys(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const handleSaveJourney =
    async (journey: Journey) => {
      try {
        if (
          editingJourney && editingJourney.id
        ) {
          await updateJourney(editingJourney.id,journey);
          setEditingJourney(null);
        } else {
          await createJourney(journey);
        }

        const updated = await getJourney();

        setJourneys(updated);
      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteJourney =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "¿Seguro que deseas eliminar este elemento del recorrido?"
        );

      if (!confirmed) return;

      await deleteJourney(id);

      const updated = await getJourney();

      setJourneys(updated);
    };

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold">
          Recorrido
        </h1>

        {editingJourney && (
          <div className="mb-4 rounded border border-blue-500 p-4">
            Editando:{" "}
            {editingJourney.title}
          </div>
        )}

        <JourneyForm onSubmit={handleSaveJourney} initialData={editingJourney}/>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="space-y-4">
            {journeys.map((journey) => (
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