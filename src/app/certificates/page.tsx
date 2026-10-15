"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CertificateForm from "@/components/certificates/CertificateForm";
import { getCertificates, createCertificate, updateCertificate, deleteCertificate, } from "@/services/certificateService";
import { Certificate } from "@/types/certificate";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [ editingCertificate, setEditingCertificate, ] = useState<Certificate | null>(null);
  // const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  const loadCertificates = async () => {
    try {
      const data = await getCertificates();

      setCertificates(data);
    } catch (error) {
      console.error(
        "Error al cargar certificados:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleSaveCertificate = async (
    certificate: Certificate
  ) => {
    try {
      if (
        editingCertificate &&
        editingCertificate.id
      ) {
        await updateCertificate(
          editingCertificate.id,
          certificate
        );

        setEditingCertificate(null);
      } else {
        await createCertificate(
          certificate
        );
      }

      const updatedCertificates = await getCertificates();

      setCertificates(
        updatedCertificates
      );
    } catch (error) {
      console.error(
        "Error al guardar certificado:",
        error
      );
    }
  };

  const handleDeleteCertificate =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "¿Seguro que deseas eliminar este certificado?"
        );

      if (!confirmed) return;

      try {
        await deleteCertificate(id);

        const updatedCertificates =
          await getCertificates();

        setCertificates(
          updatedCertificates
        );

        if (
          editingCertificate?.id === id
        ) {
          setEditingCertificate(
            null
          );
        }
      } catch (error) {
        console.error(
          "Error al eliminar certificado:",
          error
        );
      }
    };

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-6 text-3xl font-bold">
          Certificados
        </h1>

        {editingCertificate && (
          <div className="mb-4 rounded border border-blue-500 p-4">
            Editando:{" "}
            {
              editingCertificate.name
            }
          </div>
        )}

        <CertificateForm
          onSubmit={
            handleSaveCertificate
          }
          initialData={
            editingCertificate
          }
        />

        {loading ? (
          <p>
            Cargando certificados...
          </p>
        ) : certificates.length ===
          0 ? (
          <p>
            No hay certificados
            registrados.
          </p>
        ) : (
          <div className="space-y-4">
            {certificates.map(
              (certificate) => (
                <div key={ certificate.id } className="rounded-lg border p-6 shadow-sm">
                  <h2 className="text-xl font-bold">
                    {
                      certificate.name
                    }
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {
                      certificate.description
                    }
                  </p>

                  <div className="mt-4 space-y-1 text-sm">
                    <p>
                      <strong>
                        Institución:
                      </strong>{" "}
                      {
                        certificate.institution
                      }
                    </p>

                    <p>
                      <strong>
                        Categoría:
                      </strong>{" "}
                      {
                        certificate.category
                      }
                    </p>

                    {certificate.year && (
                      <p>
                        <strong>
                          Año:
                        </strong>{" "}
                        {
                          certificate.year
                        }
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    {certificate.link && (
                      <a href={certificate.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver Certificado
                      </a>
                    )}

                    {certificate.pdfUrl && (
                      <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        Ver PDF
                      </a>
                    )}

                    <button onClick={() => setEditingCertificate(certificate)} className="rounded bg-blue-600 px-3 py-1 text-white">
                      Editar
                    </button>

                    <button onClick={() => certificate.id && handleDeleteCertificate(certificate.id)} className="rounded bg-red-600 px-3 py-1 text-white">
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}