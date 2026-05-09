import { DEFAULT_FRIENDS, normalizeFriendSlug } from "@/lib/attendance";
import { resetFriendPin } from "@/lib/friends-repository";
import { fail, ok, readString } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const adminPin = readString(body.adminPin).trim();
  const slug = normalizeFriendSlug(readString(body.slug));

  if (!process.env.ADMIN_PIN) return fail("ADMIN_PIN belum disetel.", 500);
  if (adminPin !== process.env.ADMIN_PIN) return fail("PIN admin salah.", 401);
  if (!DEFAULT_FRIENDS.some((friend) => friend.slug === slug)) {
    return fail("Teman tidak ditemukan.", 404);
  }

  try {
    await resetFriendPin(slug);
    return ok({ message: "PIN teman berhasil direset ke 1234." });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal reset PIN.", 500);
  }
}
