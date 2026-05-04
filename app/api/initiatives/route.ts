import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { initiatives, NewInitiative } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const items = await db.select().from(initiatives).orderBy(asc(initiatives.sortOrder));
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: NewInitiative = await req.json();
  const [item] = await db.insert(initiatives).values(body).returning();
  return NextResponse.json(item, { status: 201 });
}
