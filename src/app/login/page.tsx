"use client";

import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setLoading(true);
    setError("");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("LOGIN RESULT:", result);

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    // Force redirect setelah login sukses
    window.location.href = "/";
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background px-6 py-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(30,64,175,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(34,197,94,0.12),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.86))]"
      />

      <div
        aria-hidden="true"
        className="grid-pattern absolute inset-0 opacity-70"
      />

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden min-h-[620px] flex-col justify-between rounded-[2rem] border border-white/70 bg-white/55 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur-md lg:flex">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-hr-primary text-sm font-bold text-white shadow-lg shadow-blue-300/50">
              HR
            </span>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              HRD Quantum Workspace
            </p>

            <h1 className="mt-3 max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              Kelola people ops dengan akses yang tepat untuk setiap level.
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
              Login menggunakan akun kerja Anda untuk membuka modul HRD yang
              relevan.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Role", value: "6", icon: "🔐" },
              { label: "Karyawan", value: "256", icon: "👥" },
              { label: "Audit", value: "Aktif", icon: "🛡️" },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm"
              >
                <span className="text-xl">{item.icon}</span>
                <strong className="mt-3 block text-2xl text-foreground">
                  {item.value}
                </strong>
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-blue-950/10 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Secure Login
                </span>
              </div>

              <h2 className="mt-3 text-3xl font-extrabold text-foreground">
                Masuk ke HRD
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Gunakan akun kerja Anda.
              </p>
            </div>

            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShieldCheck size={22} />
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              await handleLogin(formData);
            }}
          >
            <label className="block">
              <span className="text-xs font-semibold text-foreground">
                Email / Username
              </span>

              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@perusahaan.com"
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-foreground">
                Password
              </span>

              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                required
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 font-medium text-muted-foreground">
                <input
                  name="remember"
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                />
                Ingat saya
              </label>

              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-2xl text-sm font-bold"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk Dashboard"}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl bg-secondary p-4 text-center text-xs text-muted-foreground">
            <strong>Demo login:</strong> admin@perusahaan.com / admin123
          </div>
        </div>
      </section>
    </main>
  );
}
