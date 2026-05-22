'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: number;
  label: string;
}

export default function AdminDeleteHeroSlideButton({ id, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Usunąć slajd „${label}"? Tej operacji nie można cofnąć.`)) return;
    setLoading(true);
    await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-sans text-[11px] uppercase tracking-[0.15em] text-red-600 hover:text-red-800 disabled:opacity-40 transition-colors"
    >
      {loading ? '...' : 'Usuń'}
    </button>
  );
}
