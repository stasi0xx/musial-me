import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { aboutSection } from '@/lib/schema';

export async function GET() {
  const [about] = await db.select().from(aboutSection).limit(1);
  return NextResponse.json(about ?? null);
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const existing = await db.select().from(aboutSection).limit(1);

  if (existing.length === 0) {
    const [created] = await db.insert(aboutSection).values(body).returning();
    return NextResponse.json(created);
  }

  const [updated] = await db
    .update(aboutSection)
    .set({ ...body, updatedAt: new Date() })
    .returning();
  return NextResponse.json(updated);
}
