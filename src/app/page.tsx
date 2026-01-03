import { DesktopClient } from '@/components/Desktop/DesktopClient';
import { getPosts, getQuests, getItems } from '@/lib/api/services/public';

export default async function Home() {
  const [posts, quests, items] = await Promise.all([
    getPosts().catch(() => []),
    getQuests().catch(() => []),
    getItems().catch(() => []),
  ]);

  return (
    <DesktopClient
      posts={posts}
      quests={quests}
      items={items}
    />
  );
}
