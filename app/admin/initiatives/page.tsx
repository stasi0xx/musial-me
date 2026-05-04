import { db } from '@/lib/db';
import { initiatives } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import Link from 'next/link';
import AdminDeleteInitiativeButton from '@/components/AdminDeleteInitiativeButton';

export const dynamic = 'force-dynamic';

export default async function AdminInitiativesPage() {
  const items = await db
    .select({
      id: initiatives.id,
      title: initiatives.title,
      metaType: initiatives.metaType,
      metaYear: initiatives.metaYear,
      sortOrder: initiatives.sortOrder,
      isActive: initiatives.isActive,
    })
    .from(initiatives)
    .orderBy(asc(initiatives.sortOrder));

  return (
    <div>
      <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-black">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">Panel admina</p>
          <h1 className="font-serif text-4xl font-bold">Inicjatywy</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">{items.length} inicjatyw w bazie</p>
        </div>
        <Link
          href="/admin/initiatives/new"
          className="border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-3 hover:bg-white hover:text-black transition-colors"
        >
          + Nowa inicjatywa
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center border border-black/10">
          <p className="font-serif text-2xl text-gray-400 mb-2">Brak inicjatyw</p>
          <p className="font-sans text-xs uppercase tracking-widest text-gray-300">
            Utwórz pierwszą inicjatywę używając przycisku powyżej
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 w-8">#</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Tytuł</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 hidden md:table-cell">Typ</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 hidden lg:table-cell">Rok</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Status</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-right pb-3 text-gray-500">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-black/10 hover:bg-black/[0.02] group">
                <td className="py-4 pr-6">
                  <span className="font-mono text-[11px] text-gray-400">{item.sortOrder}</span>
                </td>
                <td className="py-4 pr-6">
                  <span className="font-serif font-bold text-sm leading-tight">{item.title}</span>
                </td>
                <td className="py-4 pr-6 hidden md:table-cell">
                  <span className="font-sans text-[11px] text-gray-500">{item.metaType}</span>
                </td>
                <td className="py-4 pr-6 hidden lg:table-cell">
                  <span className="font-mono text-[11px] text-gray-400">{item.metaYear || '—'}</span>
                </td>
                <td className="py-4 pr-6">
                  <span className={`font-sans text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${
                    item.isActive
                      ? 'border-black text-black'
                      : 'border-black/20 text-gray-400'
                  }`}>
                    {item.isActive ? 'Aktywna' : 'Nieaktywna'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/initiatives/${item.id}`}
                      className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:underline underline-offset-4"
                    >
                      Edytuj
                    </Link>
                    <AdminDeleteInitiativeButton id={item.id} title={item.title} />
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
