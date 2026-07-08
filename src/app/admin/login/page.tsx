"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Skip actual auth if no credentials yet (for preview)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")) {
      setError("Supabase not configured yet. Set credentials in .env.local");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-secondary border border-primary-maroon-antique/20 rounded-xl p-8 shadow-[0_0_30px_rgba(128,0,0,0.05)]">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon mb-2">Admin Portal</h1>
          <p className="text-text-primary/70">Sign in to manage Kshatriya Foods</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 text-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center rounded-sm bg-primary-maroon px-8 font-medium text-matte-black shadow-[0_0_15px_rgba(128,0,0,0.3)] transition-all hover:bg-yellow-400 disabled:opacity-70 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
