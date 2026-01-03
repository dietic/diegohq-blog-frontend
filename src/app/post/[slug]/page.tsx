import { DesktopClient } from '@/components/Desktop/DesktopClient';
import {
  getPosts,
  getQuests,
  getItems,
  getPostBySlug,
} from '@/lib/api/services/public';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const [post, posts, quests, items] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getPosts().catch(() => []),
    getQuests().catch(() => []),
    getItems().catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <DesktopClient
      posts={posts}
      quests={quests}
      items={items}
      initialPost={post}
    />
  );
}
