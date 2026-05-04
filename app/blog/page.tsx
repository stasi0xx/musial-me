import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import PublicShell from '@/components/PublicShell';
import BlogPageClient from '@/components/BlogPageClient';
import { siteData } from '@/app/data';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.date));

  return (
    <PublicShell>
      <BlogPageClient posts={posts} sectionLabel={siteData.blog.sectionLabel} />
    </PublicShell>
  );
}
