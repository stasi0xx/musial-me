import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq, desc, ne, and } from 'drizzle-orm';
import PublicShell from '@/components/PublicShell';
import BlogPostPage from '@/components/BlogPostPage';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.href, slug), eq(blogPosts.isPublished, true)))
    .limit(1);

  if (!post) notFound();

  const recentPosts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.isPublished, true), ne(blogPosts.id, post.id)))
    .orderBy(desc(blogPosts.date))
    .limit(3);

  return (
    <PublicShell>
      <BlogPostPage post={post} recentPosts={recentPosts} />
    </PublicShell>
  );
}
