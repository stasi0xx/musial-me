import { db } from '@/lib/db';
import { aboutSection } from '@/lib/schema';
import AdminAboutForm from '@/components/AdminAboutForm';

export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  const [about] = await db.select().from(aboutSection).limit(1);

  return (
    <div>
      <div className="mb-10 pb-6 border-b-2 border-black">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">Panel admina</p>
        <h1 className="font-serif text-4xl font-bold">O mnie</h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          {about ? 'Edytuj dane profilu' : 'Uzupełnij dane profilu po raz pierwszy'}
        </p>
      </div>

      <AdminAboutForm about={about ?? null} />
    </div>
  );
}
