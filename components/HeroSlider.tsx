'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface Slide {
    image: string;
    alt: string;
    caption: string;
    label: string;
}

interface HeroSliderProps {
    slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentRef = useRef(0);
    const isAnimating = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const counterRef = useRef<HTMLSpanElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const isPaused = useRef(false);

    // Init: non-active slides sit behind (z:0, rotateY:0) — hidden under active slide
    useEffect(() => {
        slides.forEach((_, i) => {
            const el = slideRefs.current[i];
            if (!el) return;
            gsap.set(el, { zIndex: i === 0 ? 1 : 0, rotateY: 0 });
        });
    }, [slides]);

    const goTo = useCallback(
        (nextIndex: number, dir: 1 | -1) => {
            if (isAnimating.current) return;
            const curr = currentRef.current;
            if (nextIndex === curr) return;
            isAnimating.current = true;

            const exitEl = slideRefs.current[curr];
            const enterEl = slideRefs.current[nextIndex];
            const exitCaption = captionRefs.current[curr];
            const enterCaption = captionRefs.current[nextIndex];

            if (!exitEl || !enterEl) { isAnimating.current = false; return; }

            // Exit on top, folding away; enter below it, ready to unfold
            gsap.set(exitEl, {
                zIndex: 2,
                rotateY: 0,
                transformOrigin: dir > 0 ? 'left center' : 'right center',
            });
            gsap.set(enterEl, {
                zIndex: 1,
                rotateY: dir > 0 ? 90 : -90,
                transformOrigin: dir > 0 ? 'right center' : 'left center',
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    slides.forEach((_, i) => {
                        if (i !== nextIndex) gsap.set(slideRefs.current[i], { zIndex: 0 });
                    });
                    gsap.set(enterEl, { zIndex: 1, rotateY: 0 });
                    currentRef.current = nextIndex;
                    setCurrentIndex(nextIndex);
                    isAnimating.current = false;
                },
            });

            // Phase 1 — current page folds away (0 → ±90deg, edge-on = invisible)
            tl.to(exitEl, {
                rotateY: dir > 0 ? -90 : 90,
                duration: 0.42,
                ease: 'power2.in',
            }, 0);

            // Shadow peaks at the "spine" moment between phases
            if (shadowRef.current) {
                tl.to(shadowRef.current, { opacity: 0.55, duration: 0.2 }, 0.2);
                tl.to(shadowRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.5);
            }

            // Phase 2 — new page unfolds in (±90deg → 0), starts just before phase 1 ends
            tl.to(enterEl, {
                rotateY: 0,
                duration: 0.42,
                ease: 'power2.out',
            }, 0.38);

            // Captions
            if (exitCaption) {
                tl.to(exitCaption, { opacity: 0, duration: 0.15 }, 0);
            }
            if (enterCaption) {
                gsap.set(enterCaption, { opacity: 0, y: 10 });
                tl.to(enterCaption, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.55);
            }

            // Counter flip — update React state while counter is invisible so correct digit renders before fade-in
            if (counterRef.current) {
                tl.to(counterRef.current, { opacity: 0, y: -6, duration: 0.15 }, 0);
                tl.call(() => {
                    setCurrentIndex(nextIndex);
                    if (counterRef.current) gsap.set(counterRef.current, { y: 8 });
                }, [], 0.16);
                tl.to(counterRef.current, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.55);
            }
        },
        [slides]
    );

    const prev = useCallback(() => {
        goTo((currentRef.current - 1 + slides.length) % slides.length, -1);
    }, [goTo, slides.length]);

    const next = useCallback(() => {
        goTo((currentRef.current + 1) % slides.length, 1);
    }, [goTo, slides.length]);

    const startAutoPlay = useCallback(() => {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            if (!isPaused.current) goTo((currentRef.current + 1) % slides.length, 1);
        }, 4500);
    }, [goTo, slides.length]);

    useEffect(() => {
        startAutoPlay();
        return () => clearInterval(autoPlayRef.current);
    }, [startAutoPlay]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [prev, next]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[16/9] md:aspect-[3/2] lg:aspect-[4/3] lg:h-full min-h-[200px] border-2 border-black overflow-hidden order-first lg:order-last bg-black select-none"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
        >
            {/* Slides */}
            {slides.map((slide, i) => (
                <div
                    key={i}
                    ref={el => { slideRefs.current[i] = el; }}
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover grayscale contrast-125"
                        priority={i === 0}
                        draggable={false}
                    />

                    {/* Caption bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black border-t-2 border-[#D0021B] px-3 py-2">
                        <div
                            ref={el => { captionRefs.current[i] = el; }}
                            className="flex items-center justify-between gap-3"
                            style={{ opacity: i === 0 ? 1 : 0 }}
                        >
                            <span className="text-white font-sans text-[10px] uppercase tracking-[0.18em] font-black whitespace-nowrap shrink-0">
                                {slide.label}
                            </span>
                            <span className="w-px h-3 bg-white/30 shrink-0" />
                            <span className="text-white/75 font-serif text-xs italic truncate">
                                {slide.caption}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Fold shadow overlay — darkens at the spine moment */}
            <div
                ref={shadowRef}
                className="absolute inset-0 pointer-events-none z-10 opacity-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)' }}
            />

            {/* Slide counter — top left */}
            <div className="absolute top-3 left-3 z-20 leading-none">
                <span
                    ref={counterRef}
                    className="font-serif font-black text-white block"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
                >
                    {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="font-sans text-white/50 text-[9px] font-bold uppercase tracking-widest">
                    / {String(slides.length).padStart(2, '0')}
                </span>
            </div>

            {/* Progress bars — top */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-0.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > currentRef.current ? 1 : -1)}
                        className="h-[3px] flex-1 cursor-pointer transition-colors"
                        style={{ backgroundColor: i === currentIndex ? '#D0021B' : 'rgba(255,255,255,0.25)' }}
                        aria-label={`Slajd ${i + 1}`}
                    />
                ))}
            </div>

            {/* Navigation arrows */}
            <div className="absolute z-20 flex gap-px" style={{ bottom: 'calc(2.25rem + 4px)', right: '0.75rem' }}>
                <button
                    onClick={prev}
                    className="bg-black/80 border border-white/20 text-white w-8 h-7 flex items-center justify-center hover:bg-[#D0021B] hover:border-[#D0021B] transition-colors font-black text-sm"
                    aria-label="Poprzednie"
                >←</button>
                <button
                    onClick={next}
                    className="bg-black/80 border border-white/20 text-white w-8 h-7 flex items-center justify-center hover:bg-[#D0021B] hover:border-[#D0021B] transition-colors font-black text-sm"
                    aria-label="Następne"
                >→</button>
            </div>
        </div>
    );
}
