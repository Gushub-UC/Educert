import Link from "next/link";

const metrics = [
  { label: "Emisión segura", value: "1 clic" },
  { label: "Integridad", value: "SHA-256" },
  { label: "Validación", value: "UUID + QR" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-xl font-bold text-cyan-300">E</div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">EduCert</p>
            <p className="text-sm text-slate-400">Certificación digital segura</p>
          </div>
        </div>
        <Link href="/login" className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
          Acceder
        </Link>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
            Seguridad por diseño
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-white">
            Emite y valida certificados académicos con confianza.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            EduCert centraliza la emisión de certificados digitales, asegura su integridad con hashes criptográficos y permite validar cualquier documento sin exponer la lógica sensible al cliente.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
              Iniciar sesión
            </Link>
            <Link href="/validate/demo" className="rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 font-semibold text-slate-100 hover:border-slate-500">
              Validar certificado
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-500/10">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">Estado del sistema</p>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">Disponible</span>
          </div>
          <div className="space-y-4">
            {metrics.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
