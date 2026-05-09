import { normalizeFriendSlug, validatePinChange } from "@/lib/attendance";
import { getFriendWithPin, updateFriendPin } from "@/lib/friends-repository";
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
  const validated = validatePinChange({
    oldPin: readString(body.oldPin),
    newPin: readString(body.newPin),
    repeatPin: readString(body.repeatPin),
  });

  if (!validated.ok) return fail(validated.message);

  try {
    const friend = await getFriendWithPin(slug);
    if (!friend) return fail("Teman tidak ditemukan.", 404);

    const verified = await verifyPin(validated.oldPin, friend.pin_hash);
    if (!verified) return fail("PIN lama salah.", 401);

    await updateFriendPin(slug, validated.newPin);
    return ok({ message: "PIN berhasil diganti." });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal mengganti PIN.", 500);
  }
}
