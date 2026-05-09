import { listFriends } from "@/lib/friends-repository";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok({ friends: await listFriends() });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Gagal memuat absensi.", 500);
  }
}
