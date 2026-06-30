'use client';

import { siteData } from '@/app/data';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/schema';

interface Props {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: Props) {
    const { blog } = siteData;

    if (posts.length === 0) return null;

    return (
        <section id="blog" className="py-20 w-full">
            <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-4 gap-4">
                <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-wide">
                    {blog.sectionLabel}
                </h2>
                <Link href="/blog" className="hidden md:inline-block px-6 py-3 border-2 border-black font-sans text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-[#f7f5ef] transition-colors mb-1">
                    Czytaj więcej
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {posts.map((post) => (
                    <article key={post.id} className="flex flex-col h-full group relative">
                        <div className="w-full h-[2px] bg-gray-200 mb-4 transition-colors duration-300 group-hover:bg-black"></div>

                        <div className="flex justify-between items-center mb-3">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 border border-transparent px-2 py-1 group-hover:border-black transition-colors duration-300">
                                {post.kicker}
                            </span>
                            {post.date && (
                                <time className="font-mono text-[10px] text-gray-400">
                                    {post.date}
                                </time>
                            )}
                        </div>

                        <div className="w-full aspect-video bg-gray-200 mb-4 overflow-hidden relative group-hover:bg-gray-300 transition-colors">
                            {post.image ? (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                </div>
                            )}
                        </div>

                        <h3 className="font-serif text-2xl lg:text-3xl font-bold leading-[1.1] mb-5 group-hover:text-gray-800">
                            <Link href={post.href ? `/blog/${post.href}` : `/blog/${post.id}`} className="block group-hover:underline decoration-2 underline-offset-4">
                                {post.title}
                            </Link>
                        </h3>

                        <p className="font-serif text-gray-600 leading-relaxed text-sm mb-6 flex-grow line-clamp-4">
                            {post.excerpt}
                        </p>

                        <div className="mt-auto pt-4 border-t border-dotted border-gray-300">
                            <Link href={post.href ? `/blog/${post.href}` : `/blog/${post.id}`} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-gray-600 transition-colors">
                                Czytaj całość <span className="text-base leading-none">→</span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            <Link href="/blog" className="md:hidden mt-12 mx-auto w-fit block px-6 py-3 border-2 border-black font-sans text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-[#f7f5ef] transition-colors">
                Czytaj więcej
            </Link>
        </section>
    );
}
