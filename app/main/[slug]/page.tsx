import { notFound } from "next/navigation";

import { FriendStatusForm } from "@/components/friend-status-form";
import { normalizeFriendSlug } from "@/lib/attendance";
import { getFriend } from "@/lib/friends-repository";

export const dynamic = "force-dynamic";

type FriendPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FriendPage({ params }: FriendPageProps) {
  const { slug: rawSlug } = await params;
  const friend = await getFriend(normalizeFriendSlug(rawSlug));

  if (!friend) notFound();

  return <FriendStatusForm friend={friend} />;
}
