import AdminInitiativeForm from '@/components/AdminInitiativeForm';
import Link from 'next/link';

export default function NewInitiativePage() {
  return (
    <div>
      <div className="mb-10 pb-6 border-b-2 border-black">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
          Panel admina · <Link href="/admin/initiatives" className="hover:underline">Inicjatywy</Link>
        </p>
        <h1 className="font-serif text-4xl font-bold">Nowa inicjatywa</h1>
      </div>

      <AdminInitiativeForm />
    </div>
  );
}
