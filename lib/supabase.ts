import { createClient } from "@supabase/supabase-js";

import type { AttendanceStatus, Friend } from "./attendance";

type FriendsRow = {
  slug: string;
  name: string;
  pin_hash: string;
  status: AttendanceStatus;
  reason: string | null;
  updated_at: string | null;
};

type Database = {
  public: {
    Tables: {
      friends: {
        Row: FriendsRow;
        Insert: FriendsRow;
        Update: Partial<FriendsRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type FriendRow = FriendsRow;
export type PublicFriend = Friend;

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
