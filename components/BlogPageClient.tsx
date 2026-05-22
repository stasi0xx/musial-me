"use client";

import { useState, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/schema";

interface Props {
  posts: BlogPost[];
  sectionLabel: string;
}

const ALL = "Wszystkie";

export default function BlogPageClient({ posts, sectionLabel }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(ALL);

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

  useGSAP(() => {
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    });
  }, { scope: headerRef });

  useGSAP(() => {
    gsap.from(gridRef.current!.querySelectorAll("article"), {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.08,
    });
  }, { scope: gridRef, dependencies: [filtered] });

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

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`font-sans text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-2 border transition-colors duration-150 ${
                activeTag === tag
                  ? "bg-black text-[#f7f5ef] border-black"
                  : "bg-transparent text-black border-black/30 hover:border-black"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

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
          filtered.map(post => (
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
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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
                  {post.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className="font-sans text-[9px] uppercase tracking-[0.15em] px-2 py-1 border border-black/20 hover:border-black hover:bg-black hover:text-[#f7f5ef] transition-colors duration-150"
                    >
                      {tag}
                    </button>
                  ))}
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
    </main>
  );
}
