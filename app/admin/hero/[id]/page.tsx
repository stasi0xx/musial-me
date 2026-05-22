import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { heroSlides } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import AdminHeroSlideForm from '@/components/AdminHeroSlideForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminHeroEditPage({ params }: Props) {
  const { id } = await params;
  const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, Number(id)));
  if (!slide) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/10">
        <Link
          href="/admin/hero"
          className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          ← Slider Hero
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="font-serif text-2xl font-bold leading-tight truncate">{slide.label}</h1>
      </div>
      <AdminHeroSlideForm slide={slide} />
    </div>
  );
}
