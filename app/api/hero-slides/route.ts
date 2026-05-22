import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { heroSlides, NewHeroSlide } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: NewHeroSlide = await req.json();
  const [slide] = await db.insert(heroSlides).values(body).returning();
  return NextResponse.json(slide, { status: 201 });
}
