import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="phone-shell rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Link tidak ditemukan</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Cek lagi link teman kamu, atau buka rekap utama.
        </p>
        <Link
          href="/main"
          className="focus-ring mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
        >
          Buka /main
        </Link>
      </section>
    </main>
  );
}
