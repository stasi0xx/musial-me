import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import AdminBlogForm from '@/components/AdminBlogForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(id)));
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/10">
        <Link
          href="/admin/blog"
          className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          ← Blog
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="font-serif text-2xl font-bold leading-tight truncate">{post.title}</h1>
      </div>
      <AdminBlogForm post={post} />
    </div>
  );
}
