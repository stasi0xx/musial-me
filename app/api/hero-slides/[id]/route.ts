import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { heroSlides } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, Number(id)));
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(slide);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const [slide] = await db
    .update(heroSlides)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(heroSlides.id, Number(id)))
    .returning();
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(slide);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.delete(heroSlides).where(eq(heroSlides.id, Number(id)));
  return new NextResponse(null, { status: 204 });
}
