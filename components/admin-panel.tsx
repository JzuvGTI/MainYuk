"use client";

import { useState } from "react";
import Link from "next/link";

import { DEFAULT_FRIENDS } from "@/lib/attendance";

export function AdminPanel() {
  const [adminPin, setAdminPin] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>(DEFAULT_FRIENDS[0].slug);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(path: string, payload: Record<string, string>) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.message || "Request gagal.");
      setMessage(data.message || "Berhasil.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="phone-shell">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-500">MainYuk</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Admin</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Reset harian dan PIN teman</p>
          </div>
          <Link
            href="/main"
            className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Rekap
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
          <label className="block text-sm font-bold text-slate-700" htmlFor="adminPin">
            PIN admin
          </label>
          <input
            id="adminPin"
            value={adminPin}
            onChange={(event) => setAdminPin(event.target.value)}
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-950"
            inputMode="numeric"
            placeholder="Masukkan ADMIN_PIN"
            type="password"
          />

          <button
            className="focus-ring mt-4 w-full rounded-2xl bg-rose-600 px-4 py-3 text-base font-black text-white transition hover:bg-rose-700"
            disabled={loading || !adminPin}
            onClick={() => submit("/api/admin/reset-status", { adminPin })}
            type="button"
          >
            Reset Absensi Hari Ini
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
          <label className="block text-sm font-bold text-slate-700" htmlFor="friend">
            Pilih teman
          </label>
          <select
            id="friend"
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-950"
          >
            {DEFAULT_FRIENDS.map((friend) => (
              <option key={friend.slug} value={friend.slug}>
                {friend.name}
              </option>
            ))}
          </select>
          <button
            className="focus-ring mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-base font-black text-white transition hover:bg-slate-800"
            disabled={loading || !adminPin}
            onClick={() =>
              submit("/api/admin/reset-pin", {
                adminPin,
                slug: selectedSlug,
              })
            }
            type="button"
          >
            Reset PIN ke 1234
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
