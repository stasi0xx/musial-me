'use client';

import React, { useRef } from 'react';
import { siteData } from '../app/data';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import HeroSlider from './HeroSlider';

export default function Hero() {
    const { hero } = siteData;
    const containerRef = useRef<HTMLDivElement>(null);
    const underlinePathRef = useRef<SVGPathElement>(null);
    const headlineWords = hero.headline.split(' ');
    const firstName = headlineWords[0];
    const lastName = headlineWords.slice(1).join(' ');

    useGSAP(() => {
        if (underlinePathRef.current) {
            const length = underlinePathRef.current.getTotalLength();
            gsap.set(underlinePathRef.current, { strokeDasharray: length, strokeDashoffset: length });

            gsap.to(underlinePathRef.current, {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.5
            });
        }
    }, { scope: containerRef });

    return (
        <section id="hero" className="w-full pb-4 scroll-mt-28" ref={containerRef}>
            <div className="text-center mb-6 md:mb-8">
                <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] font-black tracking-tight mb-2 text-gray-900 relative inline-block">
                    {firstName}{' '}
                    <span className="relative inline-block">
                        {lastName}
                        <svg
                            className="absolute w-[110%] h-[20px] -bottom-2 -left-[5%] pointer-events-none overflow-visible"
                            viewBox="0 0 100 20"
                            preserveAspectRatio="none"
                        >
                            <path
                                ref={underlinePathRef}
                                d="M0 12 Q 50 18 100 12"
                                stroke="#D0021B"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                </h1>

                <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto px-4">
                    <div className="h-[1px] bg-black flex-grow"></div>
                    <p className="font-serif text-lg md:text-xl text-gray-800 italic whitespace-nowrap">
                        {hero.deck}
                    </p>
                    <div className="h-[1px] bg-black flex-grow"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 border-b-2 border-black pb-8">
                {/* Left Column: Text */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                            {hero.lead}
                        </h2>
                        <div className="flex flex-col gap-3 mt-6">
                            <a href={hero.ctaPrimary.href} className="inline-block bg-black text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors w-max">
                                {hero.ctaPrimary.label}
                            </a>
                            <a href={hero.ctaSecondary.href} className="inline-block border-2 border-black px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors w-max">
                                {hero.ctaSecondary.label}
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-black pt-4 mt-8 lg:mt-0">
                        <div className="grid grid-cols-2 gap-4">
                            {hero.metaBar.map((item, index) => (
                                <div key={index}>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{item.label}</span>
                                    <span className="font-serif text-base">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Slider */}
                <HeroSlider slides={hero.heroSlides} />
            </div>
        </section>
    );
}
