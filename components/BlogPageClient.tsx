"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/schema";

interface Props {
  posts: BlogPost[];
  sectionLabel: string;
}

const ALL = "Wszystkie";

function TagFilter({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string;
  onSelect: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter(t => t.toLowerCase().includes(q));
  }, [tags, tagQuery]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border-2 border-black px-4 py-2.5 font-sans text-[10px] uppercase tracking-[0.15em] font-bold transition-colors duration-150 hover:bg-black hover:text-[#f7f5ef]"
      >
        <span>{activeTag === ALL ? "Filtruj po tagu" : activeTag}</span>
        <span className="text-[8px]" aria-hidden="true">▼</span>
      </button>

      {activeTag !== ALL && (
        <button
          onClick={() => onSelect(ALL)}
          className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors duration-150"
        >
          ✕ Wyczyść
        </button>
      )}

      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-lg bg-[#f7f5ef] border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b-2 border-black px-6 py-5">
              <h3 className="font-serif text-xl font-bold">
                Filtruj po tagu
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-black/5 transition-colors"
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 border-b border-black/15">
              <div className="flex items-center gap-3 border-2 border-black/30 px-4 py-3 focus-within:border-black transition-colors">
                <span className="text-gray-400 text-sm select-none">⌕</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={tagQuery}
                  onChange={e => setTagQuery(e.target.value)}
                  placeholder="Szukaj tagu…"
                  className="w-full bg-transparent font-sans text-sm focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto px-3 py-3">
              {filteredTags.length === 0 ? (
                <p className="px-3 py-6 font-sans text-xs uppercase tracking-widest text-gray-400 text-center">
                  Brak pasujących tagów
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        onSelect(tag);
                        setOpen(false);
                        setTagQuery("");
                      }}
                      className={`font-sans text-[10px] uppercase tracking-[0.15em] font-bold px-4 py-2.5 border-2 transition-colors duration-150 ${
                        activeTag === tag
                          ? "bg-black text-[#f7f5ef] border-black"
                          : "bg-transparent text-black border-black/25 hover:border-black"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function BlogPageClient({ posts, sectionLabel }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(6);

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(post => post.tags?.forEach(t => set.add(t)));
    return [ALL, ...Array.from(set).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(post => {
      const matchesTag = activeTag === ALL || post.tags?.includes(activeTag);
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.kicker.toLowerCase().includes(q) ||
        post.tags?.some(t => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  useEffect(() => {
    setVisibleCount(6);
  }, [query, activeTag]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const animatedCount = useRef(0);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  const animateNewArticles = useCallback(() => {
    if (!gridRef.current) return;
    const articles = gridRef.current.querySelectorAll("article");
    const newArticles = Array.from(articles).slice(animatedCount.current);
    if (newArticles.length === 0) return;
    gsap.from(newArticles, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.08,
    });
    animatedCount.current = articles.length;
  }, []);

  useEffect(() => {
    animatedCount.current = 0;
    animateNewArticles();
  }, [filtered, animateNewArticles]);

  useEffect(() => {
    if (animatedCount.current > 0) {
      animateNewArticles();
    }
  }, [visibleCount, animateNewArticles]);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div ref={headerRef} className="mb-12">
        <div className="border-b-4 border-black pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
              {sectionLabel}
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tight leading-none">
              Blog
            </h1>
          </div>
          <Link
            href="/"
            className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4 mb-1"
          >
            ← Strona główna
          </Link>
        </div>

        <div className="relative mb-4">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Szukaj po tytule lub słowach kluczowych…"
            className="w-full border-2 border-black bg-transparent font-sans text-sm px-4 py-3 pr-10 focus:outline-none placeholder:text-gray-400 placeholder:text-xs placeholder:uppercase placeholder:tracking-wider"
            aria-label="Szukaj artykułów"
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none text-lg"
            aria-hidden="true"
          >
            ↵
          </span>
        </div>

        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onSelect={setActiveTag}
        />

        <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400">
          {filtered.length === posts.length
            ? `${posts.length} wpisów`
            : `${filtered.length} z ${posts.length} wpisów`}
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="font-serif text-2xl text-gray-400">Brak wyników</p>
            <p className="font-sans text-xs text-gray-300 mt-2 uppercase tracking-widest">
              Spróbuj innych słów kluczowych
            </p>
          </div>
        ) : (
          visible.map(post => (
            <article key={post.id} className="flex flex-col h-full group">
              <div className="w-full h-[2px] bg-gray-200 mb-4 transition-colors duration-300 group-hover:bg-black" />

              <div className="flex justify-between items-center mb-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 border border-transparent px-2 py-1 group-hover:border-black transition-colors duration-300">
                  {post.kicker}
                </span>
                {post.date && (
                  <time className="font-mono text-[10px] text-gray-400" dateTime={post.date}>
                    {post.date}
                  </time>
                )}
              </div>

              <div className="w-full aspect-video bg-gray-200 mb-4 overflow-hidden relative">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
              </div>

              <h2 className="font-serif text-2xl lg:text-3xl font-bold leading-[1.1] mb-5">
                <Link
                  href={post.href ? `/blog/${post.href}` : `/blog/${post.id}`}
                  className="block group-hover:underline decoration-2 underline-offset-4"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="font-serif text-gray-600 leading-relaxed text-sm mb-6 flex-grow line-clamp-4">
                {post.excerpt}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 4).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className="font-sans text-[9px] uppercase tracking-[0.15em] px-2 py-1 border border-black/20 hover:border-black hover:bg-black hover:text-[#f7f5ef] transition-colors duration-150"
                    >
                      {tag}
                    </button>
                  ))}
                  {post.tags.length > 4 && (
                    <span className="font-sans text-[9px] uppercase tracking-[0.15em] px-2 py-1 text-gray-400">
                      +{post.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-dotted border-gray-300">
                <Link
                  href={post.href ? `/blog/${post.href}` : `/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-gray-600 transition-colors"
                >
                  Czytaj całość <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-16">
          <button
            onClick={() => setVisibleCount(prev => prev + 3)}
            className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold border-2 border-black px-8 py-3 hover:bg-black hover:text-[#f7f5ef] transition-colors duration-150"
          >
            Pokaż więcej ({filtered.length - visibleCount})
          </button>
        </div>
      )}
    </main>
  );
}
