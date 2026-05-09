export const DEFAULT_PIN = "1234";

export const DEFAULT_FRIENDS = [
  { name: "Faisal", slug: "faisal" },
  { name: "Alam", slug: "alam" },
  { name: "Raihan", slug: "raihan" },
  { name: "Rozik", slug: "rozik" },
  { name: "Ikbal", slug: "ikbal" },
  { name: "Denar", slug: "denar" },
  { name: "Avatar", slug: "avatar" },
] as const;

export type FriendSlug = (typeof DEFAULT_FRIENDS)[number]["slug"];
export type AttendanceStatus = "pending" | "ready" | "not_ready";

export type Friend = {
  slug: string;
  name: string;
  status: AttendanceStatus;
  reason: string | null;
  updated_at: string | null;
};

type StatusInput = {
  status: string;
  reason?: string | null;
};

type ValidStatus =
  | { ok: true; status: Exclude<AttendanceStatus, "pending">; reason: string | null }
  | { ok: false; message: string };

export function normalizeFriendSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function isKnownFriendSlug(slug: string) {
  const normalized = normalizeFriendSlug(slug);
  return DEFAULT_FRIENDS.some((friend) => friend.slug === normalized);
}

export function validateStatusInput(input: StatusInput): ValidStatus {
  if (input.status !== "ready" && input.status !== "not_ready") {
    return { ok: false, message: "Status harus Ready atau Not Ready." };
  }

  const reason = input.reason?.trim() || "";

  if (input.status === "not_ready" && !reason) {
    return { ok: false, message: "Alasan wajib diisi kalau Not Ready." };
  }

  return {
    ok: true,
    status: input.status,
    reason: input.status === "not_ready" ? reason : null,
  };
}

type PinChangeInput = {
  oldPin: string;
  newPin: string;
  repeatPin: string;
};

type ValidPinChange =
  | { ok: true; oldPin: string; newPin: string }
  | { ok: false; message: string };

export function validatePinChange(input: PinChangeInput): ValidPinChange {
  const oldPin = input.oldPin.trim();
  const newPin = input.newPin.trim();
  const repeatPin = input.repeatPin.trim();

  if (!oldPin) {
    return { ok: false, message: "PIN lama wajib diisi." };
  }

  if (newPin.length < 4) {
    return { ok: false, message: "PIN baru minimal 4 karakter." };
  }

  if (newPin !== repeatPin) {
    return { ok: false, message: "Ulangi PIN baru harus sama." };
  }

  return { ok: true, oldPin, newPin };
}

export function summarizeFriends(friends: Friend[]) {
  return friends.reduce(
    (summary, friend) => {
      summary.total += 1;
      summary[friend.status] += 1;
      return summary;
    },
    { total: 0, ready: 0, not_ready: 0, pending: 0 },
  );
}

export function statusLabel(status: AttendanceStatus) {
  if (status === "ready") return "Ready";
  if (status === "not_ready") return "Not Ready";
  return "Belum";
}
