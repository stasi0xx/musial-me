import { siteData } from '../app/data';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/schema';

interface Props {
    posts: BlogPost[];
}

export default function FeaturedSection({ posts }: Props) {
    const { featured } = siteData;

    return (
        <div id={featured.id} className="w-full">
            {/* Section Label */}
            <div className="pb-2 font-serif font-black uppercase tracking-widest text-sm">
                {featured.sectionLabel}
            </div>

            <section className="w-full border-t-4 border-black border-b border-black py-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {/* Horizontal List of Items */}
                <div className="flex items-center justify-center divide-x divide-gray-300 min-w-max mx-auto">
                    {posts.slice(0, 3).map((post) => (
                        <Link href={post.href ? `/blog/${post.href}` : `/blog/${post.id}`} key={post.id} className="group flex flex-col items-center min-w-[200px] hover:bg-neutral-100 transition-colors overflow-hidden">
                            {post.image && (
                                <div className="relative w-[90%] h-28 overflow-hidden">
                                    <Image src={post.image} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>
                            )}
                            <div className="px-6 py-2 flex flex-col justify-center text-center">
                                <h3 className="font-serif text-lg font-bold leading-tight group-hover:underline decoration-1 underline-offset-2">
                                    {post.title}
                                </h3>
                                <div className="text-xs italic text-gray-600 mt-1 font-serif">
                                    — {post.kicker}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trailing Link */}
            <Link href="/blog" className="pt-3 flex items-center justify-end gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer hover:underline">
                <span>Więcej</span>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                    <path d="M0 6L6 0M0 6L6 12M0 6H24" stroke="black" strokeWidth="1" />
                </svg>
            </Link>
        </div>
    );
}
