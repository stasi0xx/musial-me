import React from 'react';
import { siteData } from '../app/data';
import Link from 'next/link';

export default function FeaturedSection() {
    const { featured } = siteData;

    return (
        <section id={featured.id} className="w-full border-t-4 border-black border-b border-black py-4 mb-12 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center min-w-max">
                {/* Section Label */}
                <div className="pr-6 font-serif font-black uppercase tracking-widest text-sm flex-shrink-0">
                    {featured.sectionLabel}
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-8 bg-black mx-4"></div>

                {/* Horizontal List of Items */}
                <div className="flex items-center divide-x divide-gray-300">
                    {featured.cards.slice(0, 3).map((card, index) => (
                        <Link href={card.href} key={index} className="group px-6 flex flex-col justify-center min-w-[200px] hover:bg-neutral-100 transition-colors py-2">
                            <h3 className="font-serif text-lg font-bold leading-tight group-hover:underline decoration-1 underline-offset-2">
                                {card.title}
                            </h3>
                            <div className="text-xs italic text-gray-600 mt-1 font-serif">
                                — {card.kicker}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Trailing Icon/Link (Optional, mimicking the image visual) */}
                <div className="ml-auto pl-6 border-l border-gray-300 flex items-center gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer hover:underline">
                    <span>Więcej</span>
                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                        <path d="M0 6L6 0M0 6L6 12M0 6H24" stroke="black" strokeWidth="1" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
