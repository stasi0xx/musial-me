"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { AboutSection } from '@/lib/schema';

interface Props {
  about?: AboutSection | null;
}

const FIELD_CLASS = "w-full border border-black/20 bg-transparent font-sans text-sm px-3 py-2 focus:outline-none focus:border-black transition-colors";
const LABEL_CLASS = "block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function AdminAboutForm({ about }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    name: about?.name ?? '',
    role: about?.role ?? '',
    bio: about?.bio ?? '',
    image: about?.image ?? '',
  });

  function set(key: keyof typeof fields, value: string) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (res.ok) {
      router.refresh();
      setSaving(false);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Coś poszło nie tak');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* Left: bio */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <label className={LABEL_CLASS}>Imię i nazwisko *</label>
          <input
            type="text"
            required
            value={fields.name}
            onChange={e => set('name', e.target.value)}
            placeholder="np. Paweł Musiał"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Rola / Opis jednolinijkowy</label>
          <input
            type="text"
            value={fields.role}
            onChange={e => set('role', e.target.value)}
            placeholder="np. Marketingowiec · Rowerzysta · Aktywista miejski"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Bio</label>
          <textarea
            rows={10}
            value={fields.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="Dłuższy opis, kilka akapitów…"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      {/* Right: image + save */}
      <div className="flex flex-col gap-6">
        <div className="border border-black/10 p-5 flex flex-col gap-5">
          <div>
            <label className={LABEL_CLASS}>Zdjęcie profilowe</label>
            {fields.image && (
              <div className="relative w-full aspect-square mb-2 border border-black/10 overflow-hidden">
                <Image src={fields.image} alt="Podgląd" fill className="object-cover grayscale" />
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (res.ok) set('image', data.url);
                else setError(data.error ?? 'Błąd uploadu');
                setUploading(false);
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="w-full border border-black/20 font-sans text-[11px] uppercase tracking-[0.2em] py-2 hover:border-black transition-colors disabled:opacity-50"
            >
              {uploading ? 'Wysyłanie…' : fields.image ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
            </button>
            {fields.image && (
              <input
                type="text"
                value={fields.image}
                onChange={e => set('image', e.target.value)}
                className={`${FIELD_CLASS} mt-2 text-[11px] text-gray-400`}
              />
            )}
          </div>
        </div>

        {error && (
          <p className="font-sans text-xs text-red-600 border border-red-200 px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.25em] font-bold py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? 'Zapisywanie…' : 'Zapisz zmiany'}
        </button>

        {about?.updatedAt && (
          <p className="font-sans text-[10px] text-gray-400 text-center">
            Ostatnia aktualizacja: {new Date(about.updatedAt).toLocaleString('pl-PL')}
          </p>
        )}
      </div>
    </form>
  );
}
