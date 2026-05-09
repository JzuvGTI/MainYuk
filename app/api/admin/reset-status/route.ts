import { resetAllStatuses } from "@/lib/friends-repository";
import { fail, ok, readString } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const adminPin = readString(body.adminPin).trim();

  if (!process.env.ADMIN_PIN) return fail("ADMIN_PIN belum disetel.", 500);
  if (adminPin !== process.env.ADMIN_PIN) return fail("PIN admin salah.", 401);

  try {
    await resetAllStatuses();
    return ok({ message: "Absensi harian berhasil direset." });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal reset absensi.", 500);
  }
}
