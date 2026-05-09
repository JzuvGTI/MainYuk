import { MainDashboard } from "@/components/main-dashboard";
import { listFriends } from "@/lib/friends-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const friends = await listFriends();
  return <MainDashboard friends={friends} />;
}
