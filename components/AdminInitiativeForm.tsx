"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Initiative } from '@/lib/schema';
import MediaPicker from '@/components/MediaPicker';

interface Props {
  initiative?: Initiative;
}

const FIELD_CLASS = "w-full border border-black/20 bg-transparent font-sans text-sm px-3 py-2 focus:outline-none focus:border-black transition-colors";
const LABEL_CLASS = "block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function AdminInitiativeForm({ initiative }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    title: initiative?.title ?? '',
    description: initiative?.description ?? '',
    metaType: initiative?.metaType ?? '',
    metaYear: initiative?.metaYear ?? '',
    metaCategory: initiative?.metaCategory ?? '',
    goal: initiative?.goal ?? '',
    actions: initiative?.actions ?? '',
    effect: initiative?.effect ?? '',
    sortOrder: initiative?.sortOrder ?? 0,
    isActive: initiative?.isActive ?? true,
    image: initiative?.image ?? '',
  });

  function set<K extends keyof typeof fields>(key: K, value: typeof fields[K]) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = initiative ? `/api/initiatives/${initiative.id}` : '/api/initiatives';
    const method = initiative ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (res.ok) {
      router.push('/admin/initiatives');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Coś poszło nie tak');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* Left: main content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <label className={LABEL_CLASS}>Tytuł *</label>
          <input
            type="text"
            required
            value={fields.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Nazwa inicjatywy"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Opis</label>
          <textarea
            rows={4}
            value={fields.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Ogólny opis inicjatywy widoczny na listingu…"
            className={FIELD_CLASS}
          />
        </div>

        <div className="border-t border-black/10 pt-6">
          <p className={LABEL_CLASS + " mb-4"}>Szczegóły</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className={LABEL_CLASS}>Cel</label>
              <textarea
                rows={3}
                value={fields.goal}
                onChange={e => set('goal', e.target.value)}
                placeholder="Główny cel inicjatywy…"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Działania</label>
              <textarea
                rows={3}
                value={fields.actions}
                onChange={e => set('actions', e.target.value)}
                placeholder="Podjęte lub planowane działania…"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Efekt</label>
              <textarea
                rows={3}
                value={fields.effect}
                onChange={e => set('effect', e.target.value)}
                placeholder="Osiągnięty lub oczekiwany efekt…"
                className={FIELD_CLASS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: meta */}
      <div className="flex flex-col gap-6">
        <div className="border border-black/10 p-5 flex flex-col gap-5">

          <div>
            <label className={LABEL_CLASS}>Typ</label>
            <input
              type="text"
              value={fields.metaType}
              onChange={e => set('metaType', e.target.value)}
              placeholder="np. Projekt / Kampania"
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Rok</label>
            <input
              type="text"
              value={fields.metaYear}
              onChange={e => set('metaYear', e.target.value)}
              placeholder="np. 2024"
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Kategoria</label>
            <input
              type="text"
              value={fields.metaCategory}
              onChange={e => set('metaCategory', e.target.value)}
              placeholder="np. Rower / Miasto"
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Kolejność (sort)</label>
            <input
              type="number"
              value={fields.sortOrder}
              onChange={e => set('sortOrder', Number(e.target.value))}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Zdjęcie</label>
            {fields.image && (
              <div className="relative w-full h-32 mb-2 border border-black/10 overflow-hidden">
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
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex-1 border border-black/20 font-sans text-[11px] uppercase tracking-[0.2em] py-2 hover:border-black transition-colors disabled:opacity-50"
              >
                {uploading ? 'Wysyłanie…' : 'Wgraj nowe'}
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="flex-1 border border-black/20 font-sans text-[11px] uppercase tracking-[0.2em] py-2 hover:border-black transition-colors"
              >
                Z biblioteki
              </button>
            </div>
            <MediaPicker
              open={mediaPickerOpen}
              onClose={() => setMediaPickerOpen(false)}
              onSelect={url => set('image', url)}
            />
            {fields.image && (
              <input
                type="text"
                value={fields.image}
                onChange={e => set('image', e.target.value)}
                className={`${FIELD_CLASS} mt-2 text-[11px] text-gray-400`}
              />
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.isActive}
              onChange={e => set('isActive', e.target.checked)}
              className="w-4 h-4 border border-black accent-black"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Aktywna</span>
          </label>
        </div>

        {error && (
          <p className="font-sans text-xs text-red-600 border border-red-200 px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.25em] font-bold py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? 'Zapisywanie…' : uploading ? 'Wysyłanie zdjęcia…' : initiative ? 'Zapisz zmiany' : 'Utwórz inicjatywę'}
        </button>
      </div>
    </form>
  );
}
