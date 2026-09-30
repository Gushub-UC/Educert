"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [form, setForm] = useState({
    studentName: "Ana García",
    studentEmail: "ana.garcia@alumno.edu",
    courseName: "Ciberseguridad Aplicada",
    grade: "98/100",
  });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("educert:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function handleIssue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo emitir el certificado");
      }

      setStatus({
        type: "success",
        message: `Certificado emitido con folio ${data.certificate.uuid}. Validación pública: ${data.certificate.qrCodeUrl}`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Error de emisión",
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("educert:user");
    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Panel institucional</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Emisión de certificados</h1>
        </div>
        <button onClick={logout} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
          Cerrar sesión
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Usuario</p>
          <p className="mt-2 text-xl font-semibold text-white">{user?.name ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Rol</p>
          <p className="mt-2 text-xl font-semibold text-cyan-300">{user?.role ?? "ADMIN"}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Módulo</p>
          <p className="mt-2 text-xl font-semibold text-emerald-300">Certificación</p>
        </div>
      </div>

      <form onSubmit={handleIssue} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">Datos del estudiante</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Nombre completo</label>
              <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Correo electrónico</label>
              <input value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Curso o programa</label>
              <input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Calificación</label>
              <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">Seguridad</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• UUID RFC 9562 generado en servidor</li>
            <li>• PDF firmado con SHA-256</li>
            <li>• QR público para validación</li>
            <li>• Cookies HttpOnly + SameSite=Strict</li>
          </ul>

          <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-70">
            {loading ? "Emitiendo certificado..." : "Generar certificado"}
          </button>

          {status ? (
            <div className={`mt-6 rounded-xl border p-3 text-sm ${status.type === "success" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : "border-rose-500/50 bg-rose-500/10 text-rose-200"}`}>
              {status.message}
            </div>
          ) : null}
        </div>
      </form>
    </main>
  );
}
