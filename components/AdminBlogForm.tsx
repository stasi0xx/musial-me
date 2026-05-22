"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { BlogPost } from '@/lib/schema';
import RichTextEditor from '@/components/RichTextEditor';
import { toSlug } from '@/lib/slug';

interface Props {
  post?: BlogPost;
}

const FIELD_CLASS = "w-full border border-black/20 bg-transparent font-sans text-sm px-3 py-2 focus:outline-none focus:border-black transition-colors";
const LABEL_CLASS = "block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function AdminBlogForm({ post }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const slugEditedRef = useRef(Boolean(post?.href));

  const [fields, setFields] = useState({
    kicker: post?.kicker ?? '',
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    href: post?.href ?? '',
    date: post?.date ?? '',
    image: post?.image ?? '',
    tags: post?.tags?.join(', ') ?? '',
    isPublished: post?.isPublished ?? false,
    isFeatured: post?.isFeatured ?? false,
    showInBlogSection: post?.showInBlogSection ?? false,
  });

  function set(key: keyof typeof fields, value: string | boolean) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    set('title', value);
    if (!slugEditedRef.current) {
      set('href', toSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    slugEditedRef.current = true;
    set('href', toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      ...fields,
      tags: fields.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    const url = post ? `/api/blog/${post.id}` : '/api/blog';
    const method = post ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/admin/blog');
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
          <label className={LABEL_CLASS}>Kicker</label>
          <input
            type="text"
            value={fields.kicker}
            onChange={e => set('kicker', e.target.value)}
            placeholder="np. Marketing / Strategia"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Tytuł *</label>
          <input
            type="text"
            required
            value={fields.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Tytuł wpisu"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Zajawka</label>
          <textarea
            rows={3}
            value={fields.excerpt}
            onChange={e => set('excerpt', e.target.value)}
            placeholder="Krótki opis widoczny na listingach…"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Treść</label>
          <RichTextEditor
            value={fields.content}
            onChange={val => set('content', val)}
          />
        </div>
      </div>

      {/* Right: meta */}
      <div className="flex flex-col gap-6">
        <div className="border border-black/10 p-5 flex flex-col gap-5">

          <div>
            <label className={LABEL_CLASS}>Slug (URL)</label>
            <div className="flex items-center border border-black/20 focus-within:border-black transition-colors">
              <span className="font-mono text-[11px] text-gray-400 pl-3 select-none whitespace-nowrap">/blog/</span>
              <input
                type="text"
                value={fields.href}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="tytul-wpisu"
                className="flex-1 bg-transparent font-mono text-sm px-2 py-2 focus:outline-none"
              />
            </div>
            <p className="font-sans text-[10px] text-gray-400 mt-1">
              Generowany automatycznie z tytułu — możesz edytować ręcznie
            </p>
          </div>

          <div>
            <label className={LABEL_CLASS}>Data</label>
            <input
              type="date"
              value={fields.date ?? ''}
              onChange={e => set('date', e.target.value)}
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

          <div>
            <label className={LABEL_CLASS}>Tagi (oddzielone przecinkiem)</label>
            <input
              type="text"
              value={fields.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="Marketing, Gdynia, Rower"
              className={FIELD_CLASS}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.isPublished}
              onChange={e => set('isPublished', e.target.checked)}
              className="w-4 h-4 border border-black accent-black"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Opublikowany</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.isFeatured}
              onChange={e => set('isFeatured', e.target.checked)}
              className="w-4 h-4 border border-black accent-black"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Wyróżniony (FeaturedSection)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.showInBlogSection}
              onChange={e => set('showInBlogSection', e.target.checked)}
              className="w-4 h-4 border border-black accent-black"
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Pokaż w sekcji Artykuły</span>
          </label>
        </div>

        {error && (
          <p className="font-sans text-xs text-red-600 border border-red-200 px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.25em] font-bold py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? 'Zapisywanie…' : post ? 'Zapisz zmiany' : 'Utwórz wpis'}
        </button>
      </div>
    </form>
  );
}
