'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { HeroSlide } from '@/lib/schema';
import MediaPicker from '@/components/MediaPicker';

interface Props {
  slide?: HeroSlide;
}

const FIELD_CLASS = 'w-full border border-black/20 bg-transparent font-sans text-sm px-3 py-2 focus:outline-none focus:border-black transition-colors';
const LABEL_CLASS = 'block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1';

export default function AdminHeroSlideForm({ slide }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    image: slide?.image ?? '',
    alt: slide?.alt ?? '',
    caption: slide?.caption ?? '',
    label: slide?.label ?? '',
    sortOrder: slide?.sortOrder ?? 0,
    isActive: slide?.isActive ?? true,
  });

  function set<K extends keyof typeof fields>(key: K, value: typeof fields[K]) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = slide ? `/api/hero-slides/${slide.id}` : '/api/hero-slides';
    const method = slide ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (res.ok) {
      router.push('/admin/hero');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Coś poszło nie tak');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* Left: treść slajdu */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <label className={LABEL_CLASS}>Label (etykieta górna) *</label>
          <input
            type="text"
            required
            value={fields.label}
            onChange={e => set('label', e.target.value)}
            placeholder="np. PORTRET / GDYNIA"
            className={FIELD_CLASS}
          />
          <p className="font-sans text-[10px] text-gray-400 mt-1">Widoczna w pasku na dole slajdu, caps lock</p>
        </div>

        <div>
          <label className={LABEL_CLASS}>Caption (podpis)</label>
          <input
            type="text"
            value={fields.caption}
            onChange={e => set('caption', e.target.value)}
            placeholder="np. Paweł Musiał — marketing, miasto, pasje"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Alt (opis zdjęcia dla dostępności)</label>
          <input
            type="text"
            value={fields.alt}
            onChange={e => set('alt', e.target.value)}
            placeholder="np. Portret Pawła Musiała"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      {/* Right: zdjęcie + meta */}
      <div className="flex flex-col gap-6">
        <div className="border border-black/10 p-5 flex flex-col gap-5">

          <div>
            <label className={LABEL_CLASS}>Zdjęcie</label>
            {fields.image && (
              <div className="relative w-full aspect-[4/3] mb-2 border border-black/10 overflow-hidden">
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

          <div>
            <label className={LABEL_CLASS}>Kolejność (sort)</label>
            <input
              type="number"
              value={fields.sortOrder}
              onChange={e => set('sortOrder', Number(e.target.value))}
              className={FIELD_CLASS}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.isActive}
              onChange={e => set('isActive', e.target.checked)}
              className="w-4 h-4 border border-black accent-black"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Aktywny</span>
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
          {saving ? 'Zapisywanie…' : uploading ? 'Wysyłanie zdjęcia…' : slide ? 'Zapisz zmiany' : 'Utwórz slajd'}
        </button>
      </div>
    </form>
  );
}
