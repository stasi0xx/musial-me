'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { siteData } from '@/app/data';
import type { Initiative } from '@/lib/schema';

interface Props {
    initiatives: Initiative[];
}

function ProjectModal({ project, displayNumber, onClose }: { project: Initiative; displayNumber: number; onClose: () => void }) {
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
        gsap.to(panelRef.current, {
            opacity: 0,
            y: 24,
            scale: 0.97,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: onClose,
        });
    };

    useGSAP(() => {
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(panelRef.current, { opacity: 0, y: 24, scale: 0.97 });

        const tl = gsap.timeline();
        tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
            .to(panelRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }, '<');
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Panel */}
            <div ref={panelRef} className="relative z-10 w-full max-w-3xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] bg-[#f7f5ef] border-2 border-black shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b-2 border-black shrink-0">
                    <div className="flex flex-col gap-3">
                        <span className="font-mono text-sm font-bold tracking-widest text-gray-500">
                            #{String(displayNumber).padStart(2, '0')}
                        </span>
                        <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight">
                            {project.title}
                        </h2>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 font-sans text-[10px] md:text-xs uppercase tracking-widest text-gray-600">
                            <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1">{project.metaType}</span>
                            <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1">{project.metaYear}</span>
                            <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1 bg-black text-white font-bold">{project.metaCategory}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="shrink-0 w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        aria-label="Zamknij"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12">

                        {/* Left column: image + description */}
                        <div className="flex flex-col gap-6">
                            <div className="relative w-full h-48 md:h-64 shrink-0 bg-gray-200 border border-black overflow-hidden">
                                {project.image ? (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover grayscale"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                                            <div className="w-20 h-2 bg-gray-400 rounded"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="font-sans text-xs uppercase tracking-widest text-black font-bold mb-4">Opis projektu</h4>
                                <p className="font-serif text-lg md:text-xl leading-relaxed text-gray-800">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        {/* Right column: Cel / Działania / Efekt */}
                        <div className="flex flex-col gap-6 text-sm border-t border-black/20 pt-6 md:border-t-0 md:pt-0">
                            <div className="space-y-2">
                                <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Cel</h5>
                                <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.goal}</p>
                            </div>
                            <div className="space-y-2">
                                <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Działania</h5>
                                <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.actions}</p>
                            </div>
                            <div className="space-y-2">
                                <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Efekt</h5>
                                <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.effect}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProjectsStack({ initiatives }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [modalProject, setModalProject] = useState<Initiative | null>(null);
    const articleRefs = useRef<(HTMLElement | null)[]>([]);

    const toggleExpand = (id: number, index: number) => {
        const willExpand = expandedId !== id;
        setExpandedId(willExpand ? id : null);

        if (willExpand) {
            requestAnimationFrame(() => {
                articleRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    };

    const handleCardClick = (project: Initiative) => {
        setModalProject(project);
    };

    const sortedInitiatives = [...initiatives].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <>
            <section id="initiatives" className="py-20 w-full">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-20 uppercase tracking-wide border-b-4 border-black pb-4">
                    {siteData.projects.sectionLabel}
                </h2>

                <div className="flex flex-col pb-40">
                    {sortedInitiatives.map((project, index) => {
                        const isExpanded = expandedId === project.id;
                        const displayNumber = index + 1;
                        const tabHeight = 64;
                        const topOffset = 80 + (index * tabHeight);

                        return (
                            <article
                                key={project.id}
                                ref={(el) => { articleRefs.current[index] = el; }}
                                className="group w-full transition-all duration-300 ease-in-out pt-4 md:pt-10 pb-5 sticky top-[52px] md:top-[var(--top-offset)] scroll-mt-[52px] md:scroll-mt-[var(--top-offset)]"
                                style={{
                                    '--top-offset': `${topOffset}px`,
                                    zIndex: index + 10
                                } as CSSProperties}
                            >
                                {/* Folder Container */}
                                <div
                                    onClick={() => handleCardClick(project)}
                                    className={`
                                        relative w-full cursor-pointer
                                        bg-[#f7f5ef] text-black
                                        shadow-xl border-2 border-black
                                        transition-all duration-300
                                        ${isExpanded ? 'min-h-[620px] md:min-h-[500px]' : 'min-h-[120px] hover:translate-y-[-5px]'}
                                    `}
                                >
                                    {/* Tab (Top Left) — desktop only */}
                                    <div className="hidden md:flex absolute -top-12 -left-[2px] h-12 min-w-[140px] bg-[#f7f5ef] items-center justify-center px-6 border-t-2 border-l-2 border-r-2 border-black">
                                        <span className="font-mono text-xl font-bold tracking-widest text-black">
                                            #{String(displayNumber).padStart(2, '0')}
                                        </span>
                                        <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-[#f7f5ef] z-10"></div>
                                    </div>

                                    {/* Main Body Content */}
                                    <div className="p-6 md:p-10 flex flex-col gap-6">

                                        {/* Header Row */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black pb-6">
                                            <div className="flex items-center gap-3 md:contents">
                                                <span className="md:hidden font-mono text-lg font-bold tracking-widest text-black shrink-0">
                                                    #{String(displayNumber).padStart(2, '0')}
                                                </span>
                                                <h3 className="text-2xl md:text-5xl font-serif font-bold leading-tight">
                                                    {project.title}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 md:gap-3 font-sans text-[10px] md:text-xs uppercase tracking-widest text-gray-600">
                                                <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1">{project.metaType}</span>
                                                <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1">{project.metaYear}</span>
                                                <span className="border border-black px-1.5 py-0.5 md:px-2 md:py-1 bg-black text-white font-bold">{project.metaCategory}</span>
                                            </div>
                                        </div>

                                        {/* Content Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                                            {/* Left: Image */}
                                            <div className="md:col-span-4 aspect-video md:aspect-[4/3] bg-gray-200 border border-black overflow-hidden relative group-hover:bg-gray-300 transition-colors">
                                                {project.image ? (
                                                    <Image
                                                        src={project.image}
                                                        alt={project.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                                            <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                                                            <div className="w-20 h-2 bg-gray-400 rounded"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Description & Details */}
                                            <div className="md:col-span-8 flex flex-col justify-between">
                                                <div className="space-y-6">
                                                    <h4 className="font-sans text-sm uppercase tracking-widest text-black font-bold">Opis projektu</h4>
                                                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800 line-clamp-3">
                                                        {project.description}
                                                    </p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setModalProject(project); }}
                                                        className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors border-b border-gray-400 hover:border-black pb-px"
                                                    >
                                                        Czytaj dalej
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </div>

                                                {/* Expanded Details */}
                                                <div
                                                    className={`
                                                        mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm
                                                        overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-in-out
                                                        ${isExpanded ? 'max-h-[500px] opacity-100 pt-8 border-t border-black' : 'max-h-0 opacity-0 mt-0'}
                                                    `}
                                                >
                                                    <div className="space-y-2">
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Cel</h5>
                                                        <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.goal}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Działania</h5>
                                                        <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.actions}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-black font-bold">Efekt</h5>
                                                        <p className="font-serif text-lg md:text-xl text-black leading-relaxed">{project.effect}</p>
                                                    </div>
                                                </div>

                                                {/* Expand Hint */}
                                                {!isExpanded && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(project.id, index); }}
                                                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black group-hover:text-black transition-colors"
                                                    >
                                                        <span>Kliknij, aby zobaczyć szczegóły</span>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {modalProject && (
                <ProjectModal
                    project={modalProject}
                    displayNumber={sortedInitiatives.findIndex((p) => p.id === modalProject.id) + 1}
                    onClose={() => setModalProject(null)}
                />
            )}
        </>
    );
}
