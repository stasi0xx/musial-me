import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { blogPosts, NewBlogPost } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: NewBlogPost = await req.json();
  const [post] = await db.insert(blogPosts).values(body).returning();
  return NextResponse.json(post, { status: 201 });
}
