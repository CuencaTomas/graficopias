"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Isotipo } from "@/components/Isotipo";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/pedidos";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const resultado = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (resultado?.error) {
      setError("Email o contraseña incorrectos");
      setEnviando(false);
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Isotipo className="h-10 w-10 text-rojo" />
        <h1 className="text-lg font-bold tracking-wide text-blanco">GRAFICOPIAS</h1>
        <p className="text-sm text-white/50">Panel de administración</p>
      </div>

      <form onSubmit={ingresar} className="mt-8 flex flex-col gap-3">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-blanco placeholder:text-white/40 focus:border-rojo focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-blanco placeholder:text-white/40 focus:border-rojo focus:outline-none"
        />

        {error && <p className="text-sm text-rojo">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 rounded-lg bg-rojo px-4 py-3 font-semibold text-blanco transition hover:brightness-110 disabled:opacity-50"
        >
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
