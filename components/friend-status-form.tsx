"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { type Friend, statusLabel } from "@/lib/attendance";

import { StatusBadge } from "./status-badge";

type FriendStatusFormProps = {
  friend: Friend;
};

type RequestState = "idle" | "loading";

export function FriendStatusForm({ friend }: FriendStatusFormProps) {
  const storageKey = useMemo(() => `mainyuk-pin-${friend.slug}`, [friend.slug]);
  const [pin, setPin] = useState("");
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState<"ready" | "not_ready">(
    friend.status === "not_ready" ? "not_ready" : "ready",
  );
  const [reason, setReason] = useState(friend.reason ?? "");
  const [message, setMessage] = useState("");
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [showPinForm, setShowPinForm] = useState(false);
  const [pinForm, setPinForm] = useState({ oldPin: "", newPin: "", repeatPin: "" });

  useEffect(() => {
    const savedPin = window.sessionStorage.getItem(storageKey);
    if (savedPin) setPin(savedPin);
  }, [storageKey]);

  async function submitJson(path: string, payload: Record<string, string>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request gagal.");
    }

    return data as { message?: string };
  }

  async function verifyAccess() {
    setRequestState("loading");
    setMessage("");
    try {
      await submitJson(`/api/friends/${friend.slug}/verify`, { pin });
      window.sessionStorage.setItem(storageKey, pin);
      setVerified(true);
      setMessage("PIN benar. Kamu bisa isi status sekarang.");
    } catch (error) {
      setVerified(false);
      setMessage(error instanceof Error ? error.message : "PIN salah.");
    } finally {
      setRequestState("idle");
    }
  }

  async function saveStatus() {
    setRequestState("loading");
    setMessage("");
    try {
      const data = await submitJson(`/api/friends/${friend.slug}/status`, {
        pin,
        status,
        reason,
      });
      setMessage(data.message || "Status berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan status.");
    } finally {
      setRequestState("idle");
    }
  }

  async function changePin() {
    setRequestState("loading");
    setMessage("");
    try {
      const data = await submitJson(`/api/friends/${friend.slug}/pin`, pinForm);
      window.sessionStorage.setItem(storageKey, pinForm.newPin);
      setPin(pinForm.newPin);
      setPinForm({ oldPin: "", newPin: "", repeatPin: "" });
      setShowPinForm(false);
      setMessage(data.message || "PIN berhasil diganti.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengganti PIN.");
    } finally {
      setRequestState("idle");
    }
  }

  const loading = requestState === "loading";

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="phone-shell">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-500">MainYuk</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Halo, {friend.name}</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Isi status kamu saja</p>
          </div>
          <Link
            href="/main"
            className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Rekap
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Status sekarang
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {statusLabel(friend.status)}
              </p>
            </div>
            <StatusBadge status={friend.status} />
          </div>

          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="pin">
            PIN {friend.name}
          </label>
          <input
            id="pin"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            inputMode="numeric"
            className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-950"
            placeholder="Masukkan PIN"
            type="password"
          />
          <button
            className="focus-ring mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-base font-black text-white transition hover:bg-slate-800"
            disabled={loading || !pin}
            onClick={verifyAccess}
            type="button"
          >
            {verified ? "PIN Terverifikasi" : "Buka Absensi"}
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`focus-ring rounded-2xl px-4 py-4 text-base font-black transition ${
                status === "ready"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700"
              }`}
              disabled={!verified || loading}
              onClick={() => setStatus("ready")}
              type="button"
            >
              Ready
            </button>
            <button
              className={`focus-ring rounded-2xl px-4 py-4 text-base font-black transition ${
                status === "not_ready" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700"
              }`}
              disabled={!verified || loading}
              onClick={() => setStatus("not_ready")}
              type="button"
            >
              Not Ready
            </button>
          </div>

          {status === "not_ready" ? (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="reason">
                Alasan Not Ready
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="focus-ring min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-950"
                disabled={!verified || loading}
                placeholder="Contoh: masih kerja, belum pasti, ada urusan"
              />
            </div>
          ) : null}

          <button
            className="focus-ring mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-base font-black text-white transition hover:bg-blue-700"
            disabled={!verified || loading}
            onClick={saveStatus}
            type="button"
          >
            Simpan Status
          </button>

          <button
            className="focus-ring mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-700"
            disabled={!verified || loading}
            onClick={() => setShowPinForm((value) => !value)}
            type="button"
          >
            Ganti PIN
          </button>
        </div>

        {showPinForm ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
            <h2 className="text-xl font-black text-slate-950">Ganti PIN</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Isi PIN lama, PIN baru, dan ulangi PIN baru.
            </p>
            <div className="mt-4 grid gap-3">
              <PinInput
                label="PIN lama"
                value={pinForm.oldPin}
                onChange={(value) => setPinForm((form) => ({ ...form, oldPin: value }))}
              />
              <PinInput
                label="PIN baru"
                value={pinForm.newPin}
                onChange={(value) => setPinForm((form) => ({ ...form, newPin: value }))}
              />
              <PinInput
                label="Ulangi PIN baru"
                value={pinForm.repeatPin}
                onChange={(value) => setPinForm((form) => ({ ...form, repeatPin: value }))}
              />
            </div>
            <button
              className="focus-ring mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-base font-black text-white"
              disabled={loading}
              onClick={changePin}
              type="button"
            >
              Simpan PIN Baru
            </button>
          </div>
        ) : null}

        {message ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}

function PinInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-950"
        inputMode="numeric"
        type="password"
      />
    </label>
  );
}
