import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { toSlug } from '@/lib/slug';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(id)));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const [post] = await db
    .update(blogPosts)
    .set({
      kicker: body.kicker,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      href: toSlug(body.href ?? body.title ?? ''),
      date: body.date,
      image: body.image,
      tags: body.tags,
      isPublished: body.isPublished,
      isFeatured: body.isFeatured,
      showInBlogSection: body.showInBlogSection,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, Number(id)))
    .returning();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, Number(id)));
  return new NextResponse(null, { status: 204 });
}
