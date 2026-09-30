"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ValidatePage() {
  const params = useParams<{ uuid: string }>();
  const [uuid, setUuid] = useState(params?.uuid ?? "");
  const [result, setResult] = useState<{ valid: boolean; message: string; certificate?: Record<string, unknown> } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.uuid) {
      setUuid(params.uuid);
      void validateCertificate(params.uuid);
    }
  }, [params]);

  async function validateCertificate(inputUuid: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/certificates/validate/${inputUuid}`);
      const data = await response.json();
      setResult({ valid: !!data.valid, message: data.message ?? "Sin resultado", certificate: data.certificate ?? null });
    } catch {
      setResult({ valid: false, message: "Certificado No Encontrado" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uuid.trim()) return;
    await validateCertificate(uuid.trim());
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-500/10">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Validación pública</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Verificación de autenticidad</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
          <input
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Ingresa UUID del certificado"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />
          <button type="submit" disabled={loading} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
            {loading ? "Validando..." : "Validar"}
          </button>
        </form>

        {result ? (
          <div className={`mt-8 rounded-2xl border p-5 ${result.valid ? "border-emerald-500/50 bg-emerald-500/10" : "border-rose-500/50 bg-rose-500/10"}`}>
            <h2 className={`text-2xl font-bold ${result.valid ? "text-emerald-300" : "text-rose-300"}`}>
              {result.valid ? "Certificado Válido y Auténtico" : result.message}
            </h2>
            {result.certificate ? (
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                <p><strong>UUID:</strong> {String(result.certificate.uuid ?? "-")}</p>
                <p><strong>Estudiante:</strong> {String(result.certificate.studentName ?? "-")}</p>
                <p><strong>Curso:</strong> {String(result.certificate.courseName ?? "-")}</p>
                <p><strong>Calificación:</strong> {String(result.certificate.grade ?? "-")}</p>
                <p><strong>Estado:</strong> {String(result.certificate.status ?? "ACTIVE")}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
