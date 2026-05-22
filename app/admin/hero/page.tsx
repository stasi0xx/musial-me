import { db } from '@/lib/db';
import { heroSlides } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import Link from 'next/link';
import AdminDeleteHeroSlideButton from '@/components/AdminDeleteHeroSlideButton';

export const dynamic = 'force-dynamic';

export default async function AdminHeroPage() {
  const slides = await db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.sortOrder));

  return (
    <div>
      <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-black">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">Panel admina</p>
          <h1 className="font-serif text-4xl font-bold">Slider Hero</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">{slides.length} slajdów w bazie</p>
        </div>
        <Link
          href="/admin/hero/new"
          className="border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-3 hover:bg-white hover:text-black transition-colors"
        >
          + Nowy slajd
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="py-20 text-center border border-black/10">
          <p className="font-serif text-2xl text-gray-400 mb-2">Brak slajdów</p>
          <p className="font-sans text-xs uppercase tracking-widest text-gray-300">
            Utwórz pierwszy slajd używając przycisku powyżej
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 w-8">#</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Label</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 hidden md:table-cell">Caption</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Status</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-right pb-3 text-gray-500">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(slide => (
              <tr key={slide.id} className="border-b border-black/10 hover:bg-black/[0.02] group">
                <td className="py-4 pr-6">
                  <span className="font-mono text-[11px] text-gray-400">{slide.sortOrder}</span>
                </td>
                <td className="py-4 pr-6">
                  <span className="font-sans font-bold text-sm uppercase tracking-wider">{slide.label}</span>
                </td>
                <td className="py-4 pr-6 hidden md:table-cell">
                  <span className="font-serif text-sm italic text-gray-600 truncate block max-w-xs">{slide.caption}</span>
                </td>
                <td className="py-4 pr-6">
                  <span className={`font-sans text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${
                    slide.isActive
                      ? 'border-black text-black'
                      : 'border-black/20 text-gray-400'
                  }`}>
                    {slide.isActive ? 'Aktywny' : 'Ukryty'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/hero/${slide.id}`}
                      className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:underline underline-offset-4"
                    >
                      Edytuj
                    </Link>
                    <AdminDeleteHeroSlideButton id={slide.id} label={slide.label} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
