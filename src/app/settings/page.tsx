"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, } from "firebase/auth";
import { auth } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProjects } from "@/services/projectService";
import { getCertificates } from "@/services/certificateService";
import { getJourney } from "@/services/journeyService";
import { getResources } from "@/services/resourceService";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  // const [userUid, setUserUid] = useState("");
  const [stats, setStats] = useState({projects: 0, certificates: 0, journey: 0, resources: 0, });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserEmail(  user.email || "" );
            // setUserUid( user.uid || "" );
          }
        }
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [ projects, certificates, journey, resources, ] = await Promise.all([ getProjects(), getCertificates(), getJourney(), getResources(), ]);

      setStats({
        projects: projects.length,
        certificates: certificates.length,
        journey: journey.length,
        resources: resources.length,
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error );
    }
  };

  loadStats();
}, []);

  const handlePasswordReset = async () => {
    try {
      const user = auth.currentUser;

      if (!user?.email) {
        alert( "No se ha encontrado un correo asociado."
        );

        return;
      }

      await sendPasswordResetEmail(
        auth,
        user.email
      );

      alert( "Se ha enviado un correo para cambiar la contraseña."
      );
    } catch (error) {
      console.error(error);

      alert( "Ha ocurrido un error al enviar el correo."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          Ajustes
        </h1>

        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold"> Perfil </h2>

          <div className="space-y-2">
            <p> <strong>Correo:</strong>{" "} {userEmail || "No disponible"} </p>
            {/* <p> <strong>UID:</strong>{" "} {userUid || "No disponible"} </p> */}
          </div>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold"> Seguridad </h2>

          <button onClick={handlePasswordReset} className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            Cambiar contraseña
          </button>

          <p className="mt-3 text-sm text-gray-400"> Se enviará un correo de recuperación a tu cuenta. </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold"> Información del CMS </h2>

          <div className="space-y-2 text-sm">
            <p> <strong>Versión:</strong>{" "} 1.5.0 </p>
            <p> <strong>Framework:</strong>{" "} Next.js </p>
            <p> <strong>Base de datos:</strong>{" "} Firebase Firestore </p>
            <p> <strong>Autenticación:</strong>{" "} Firebase Authentication </p>
            <p> <strong>Archivos:</strong>{" "} Cloudinary </p>
          </div>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold"> Estado del CMS </h2>
          <div className="space-y-2 text-sm">
            <p> ✅ Gestión de proyectos </p>
            <p> ✅ Gestión de certificados </p>
            <p> ✅ Gestión de recorrido </p>
            <p> ✅ Gestión de recursos </p>
            <p> ✅ Dashboard estadístico </p>
          </div>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold"> Estadísticas Generales </h2>
          <div className="space-y-2 text-sm">
            <p> 📁 Proyectos: {stats.projects} </p>
            <p> 🎓 Certificados: {stats.certificates} </p>
            <p> 🧭 Recorrido: {stats.journey} </p>
            <p> 🔗 Recursos: {stats.resources} </p>
            <p> 📦 Total de elementos:{" "} {stats.projects + stats.certificates + stats.journey + stats.resources} </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}