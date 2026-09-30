import { LoginForm } from "@/app/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">EduCert</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Inicio de sesión</h1>
        </div>

        <LoginForm />

        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          Rate limiting simulado: 3 intentos por 60s. Credenciales demo activas para administrador.
        </div>
      </div>
    </main>
  );
}
