import { DEFAULT_FRIENDS, DEFAULT_PIN, type AttendanceStatus, type Friend } from "./attendance";
import { hashPin } from "./pins";
import { getSupabaseAdmin, type FriendRow } from "./supabase";

function publicFriend(row: FriendRow): Friend {
  return {
    slug: row.slug,
    name: row.name,
    status: row.status,
    reason: row.reason,
    updated_at: row.updated_at,
  };
}

function fallbackFriends(): Friend[] {
  return DEFAULT_FRIENDS.map((friend) => ({
    ...friend,
    status: "pending",
    reason: null,
    updated_at: null,
  }));
}

export async function listFriends(): Promise<Friend[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackFriends();

  const { data, error } = await supabase
    .from("friends")
    .select("slug,name,pin_hash,status,reason,updated_at")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  const order = new Map<string, number>(DEFAULT_FRIENDS.map((friend, index) => [friend.slug, index]));
  return data
    .map(publicFriend)
    .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99));
}

export async function getFriend(slug: string): Promise<Friend | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackFriends().find((friend) => friend.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("friends")
    .select("slug,name,pin_hash,status,reason,updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? publicFriend(data) : null;
}

export async function getFriendWithPin(slug: string): Promise<FriendRow | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase belum disetel.");

  const { data, error } = await supabase
    .from("friends")
    .select("slug,name,pin_hash,status,reason,updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateFriendStatus(
  slug: string,
  status: Exclude<AttendanceStatus, "pending">,
  reason: string | null,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase belum disetel.");

  const { error } = await supabase
    .from("friends")
    .update({
      status,
      reason,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
}

export async function updateFriendPin(slug: string, nextPin: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase belum disetel.");

  const { error } = await supabase
    .from("friends")
    .update({
      pin_hash: await hashPin(nextPin),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
}

export async function resetAllStatuses() {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase belum disetel.");

  const { error } = await supabase.from("friends").update({
    status: "pending",
    reason: null,
    updated_at: new Date().toISOString(),
  }).neq("slug", "");

  if (error) throw new Error(error.message);
}

export async function resetFriendPin(slug: string) {
  await updateFriendPin(slug, DEFAULT_PIN);
}
