"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/schema";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  post: BlogPost;
  recentPosts: BlogPost[];
}

function stripEmptyListItems(html: string): string {
  return html
    .replace(/<li>\s*<p>\s*(<br\s*\/?>)?\s*<\/p>\s*<\/li>/gi, "")
    .replace(/<li>\s*(<br\s*\/?>)?\s*<\/li>/gi, "");
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function BlogPostPage({ post, recentPosts }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.2,
        });
      }
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.35,
      });

      if (recentRef.current) {
        gsap.from(recentRef.current.querySelectorAll("article"), {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: recentRef.current,
            start: "top 80%",
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Back button */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4"
        >
          ← Strona główna
        </Link>
      </div>

      {/* Post header */}
      <div ref={headerRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="border-t-4 border-black pt-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            {post.kicker && (
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500">
                {post.kicker}
              </span>
            )}
            {post.date && (
              <time className="font-mono text-[10px] text-gray-400" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] tracking-tight max-w-5xl mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="font-serif text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl border-l-4 border-black/10 pl-6">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Hero image */}
      {post.image && (
        <div ref={imageRef} className="w-full mb-14">
          <div className="relative w-full aspect-[16/7] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-10">
        {post.content ? (
          <div
            className="prose-editorial"
            dangerouslySetInnerHTML={{ __html: stripEmptyListItems(post.content) }}
          />
        ) : (
          <p className="font-serif text-lg leading-relaxed text-gray-700">{post.excerpt}</p>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-20">
          <div className="flex flex-wrap gap-2 pt-8 border-t border-black/10">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href="/blog"
                className="font-sans text-[9px] uppercase tracking-[0.15em] px-3 py-1 border border-black/20 hover:border-black hover:bg-black hover:text-[#f7f5ef] transition-colors duration-150"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div ref={recentRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <div className="border-t-4 border-black pt-8 mb-12 flex items-end justify-between">
            <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-wide">
              Najnowsze wpisy
            </h2>
            <Link
              href="/blog"
              className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4 mb-1"
            >
              Wszystkie wpisy →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {recentPosts.map((recent) => (
              <article key={recent.id} className="flex flex-col h-full group">
                <div className="w-full h-[2px] bg-gray-200 mb-4 transition-colors duration-300 group-hover:bg-black" />

                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 border border-transparent px-2 py-1 group-hover:border-black transition-colors duration-300">
                    {recent.kicker}
                  </span>
                  {recent.date && (
                    <time className="font-mono text-[10px] text-gray-400" dateTime={recent.date}>
                      {recent.date}
                    </time>
                  )}
                </div>

                {recent.image && (
                  <div className="w-full aspect-video bg-gray-200 mb-4 overflow-hidden relative">
                    <Image
                      src={recent.image}
                      alt={recent.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}

                <h3 className="font-serif text-2xl font-bold leading-[1.1] mb-4">
                  <Link
                    href={recent.href ? `/blog/${recent.href}` : `/blog/${recent.id}`}
                    className="block group-hover:underline decoration-2 underline-offset-4"
                  >
                    {recent.title}
                  </Link>
                </h3>

                <p className="font-serif text-gray-600 leading-relaxed text-sm mb-6 flex-grow line-clamp-3">
                  {recent.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-dotted border-gray-300">
                  <Link
                    href={recent.href ? `/blog/${recent.href}` : `/blog/${recent.id}`}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-gray-600 transition-colors"
                  >
                    Czytaj całość <span className="text-base leading-none">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
