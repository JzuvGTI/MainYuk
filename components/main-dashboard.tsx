import Link from "next/link";

import { summarizeFriends, type Friend } from "@/lib/attendance";

import { StatusBadge } from "./status-badge";

type MainDashboardProps = {
  friends: Friend[];
};

export function MainDashboard({ friends }: MainDashboardProps) {
  const summary = summarizeFriends(friends);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="phone-shell lg:w-full lg:max-w-5xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-slate-950">MainYuk</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">List lengkap teman hari ini</p>
          </div>
          <Link
            href="/main/admin"
            className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Admin
          </Link>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <SummaryTile label="Ready" value={summary.ready} tone="ready" />
          <SummaryTile label="Not" value={summary.not_ready} tone="not" />
          <SummaryTile label="Belum" value={summary.pending} tone="pending" />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {friends.map((friend) => (
            <article
              key={friend.slug}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950">{friend.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">/main/{friend.slug}</p>
                </div>
                <StatusBadge status={friend.status} />
              </div>
              {friend.reason ? (
                <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  Alasan: {friend.reason}
                </p>
              ) : null}
              <Link
                href={`/main/${friend.slug}`}
                className="focus-ring mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Buka link {friend.name}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ready" | "not" | "pending";
}) {
  const toneClass = {
    ready: "text-emerald-700",
    not: "text-rose-700",
    pending: "text-slate-600",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm shadow-slate-200/70">
      <strong className={`block text-2xl font-black ${toneClass}`}>{value}</strong>
      <span className="text-xs font-bold text-slate-500">{label}</span>
    </div>
  );
}
