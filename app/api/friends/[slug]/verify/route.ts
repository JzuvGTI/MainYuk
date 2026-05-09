import { normalizeFriendSlug } from "@/lib/attendance";
import { getFriendWithPin } from "@/lib/friends-repository";
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

  if (!pin) return fail("PIN wajib diisi.");

  try {
    const friend = await getFriendWithPin(slug);
    if (!friend) return fail("Teman tidak ditemukan.", 404);

    const verified = await verifyPin(pin, friend.pin_hash);
    if (!verified) return fail("PIN salah.", 401);

    return ok({
      friend: {
        slug: friend.slug,
        name: friend.name,
        status: friend.status,
        reason: friend.reason,
        updated_at: friend.updated_at,
      },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal verifikasi PIN.", 500);
  }
}
