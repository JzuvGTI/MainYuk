import { normalizeFriendSlug, validateStatusInput } from "@/lib/attendance";
import { getFriendWithPin, updateFriendStatus } from "@/lib/friends-repository";
import { fail, ok, readString } from "@/lib/http";
import { verifyPin } from "@/lib/pins";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: Context) {
  const { slug: rawSlug } = await context.params;
  const slug = normalizeFriendSlug(rawSlug);
  const body = await request.json().catch(() => ({}));
  const pin = readString(body.pin).trim();
  const status = readString(body.status);
  const reason = readString(body.reason);

  if (!pin) return fail("PIN wajib diisi.");

  const validated = validateStatusInput({ status, reason });
  if (!validated.ok) return fail(validated.message);

  try {
    const friend = await getFriendWithPin(slug);
    if (!friend) return fail("Teman tidak ditemukan.", 404);

    const verified = await verifyPin(pin, friend.pin_hash);
    if (!verified) return fail("PIN salah.", 401);

    await updateFriendStatus(slug, validated.status, validated.reason);
    return ok({ message: "Status berhasil disimpan." });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal menyimpan status.", 500);
  }
}
