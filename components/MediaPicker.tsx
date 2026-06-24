"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface MediaImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  createdAt: string;
  format: string;
  bytes: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPicker({ open, onClose, onSelect }: Props) {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetchImages = useCallback(async (cursor?: string) => {
    setLoading(true);
    const params = cursor ? `?cursor=${cursor}` : '';
    const res = await fetch(`/api/media${params}`);
    if (res.ok) {
      const data = await res.json();
      setImages(prev => cursor ? [...prev, ...data.images] : data.images);
      setNextCursor(data.nextCursor);
    }
    setLoading(false);
    setFetched(true);
  }, []);

  useEffect(() => {
    if (open && !fetched) fetchImages();
  }, [open, fetched, fetchImages]);

  useEffect(() => {
    if (!open) setFetched(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[#f7f5ef] border border-black/20 w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/10">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">
            Biblioteka mediów
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-lg leading-none hover:opacity-60 transition-opacity"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading && images.length === 0 ? (
            <p className="font-sans text-sm text-gray-500 text-center py-12">Ładowanie…</p>
          ) : images.length === 0 ? (
            <p className="font-sans text-sm text-gray-500 text-center py-12">Brak zdjęć w bibliotece</p>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map(img => (
                  <button
                    key={img.publicId}
                    type="button"
                    onClick={() => { onSelect(img.url); onClose(); }}
                    className="group relative aspect-square border border-black/10 overflow-hidden hover:border-black transition-colors"
                  >
                    <Image
                      src={img.url}
                      alt={img.publicId.split('/').pop() ?? ''}
                      fill
                      sizes="160px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-sans text-[9px] truncate">{img.publicId.split('/').pop()}</p>
                      <p className="font-sans text-[9px] text-white/60">{img.width}&times;{img.height} &middot; {formatSize(img.bytes)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {nextCursor && (
                <div className="flex justify-center mt-5">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => fetchImages(nextCursor)}
                    className="border border-black/20 font-sans text-[11px] uppercase tracking-[0.2em] px-6 py-2 hover:border-black transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Ładowanie…' : 'Załaduj więcej'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
