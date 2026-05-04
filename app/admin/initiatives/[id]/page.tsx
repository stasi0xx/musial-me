import { db } from '@/lib/db';
import { initiatives } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminInitiativeForm from '@/components/AdminInitiativeForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInitiativePage({ params }: Props) {
  const { id } = await params;
  const [initiative] = await db.select().from(initiatives).where(eq(initiatives.id, Number(id)));

  if (!initiative) notFound();

  return (
    <div>
      <div className="mb-10 pb-6 border-b-2 border-black">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
          Panel admina · <Link href="/admin/initiatives" className="hover:underline">Inicjatywy</Link>
        </p>
        <h1 className="font-serif text-4xl font-bold">{initiative.title}</h1>
      </div>

      <AdminInitiativeForm initiative={initiative} />
    </div>
  );
}
