'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { siteData } from '@/app/data';
import type { Initiative } from '@/lib/schema';

interface Props {
    initiatives: Initiative[];
}

function ProjectModal({ project, onClose }: { project: Initiative; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-[#f7f5ef] border-2 border-black shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b-2 border-black shrink-0">
                    <div className="flex flex-col gap-3">
                        <span className="font-mono text-sm font-bold tracking-widest text-gray-500">
                            #{String(project.id).padStart(2, '0')}
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
                        onClick={onClose}
                        className="shrink-0 w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        aria-label="Zamknij"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-6 md:p-8 flex flex-col gap-8">
                    <div>
                        <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Opis projektu</h4>
                        <p className="font-serif text-lg md:text-xl leading-relaxed text-gray-800">
                            {project.description}
                        </p>
                    </div>

                    {/* Mobile: stacked below description */}
                    <div className="flex flex-col gap-6 text-sm md:hidden border-t border-black/20 pt-6">
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Cel</h5>
                            <p className="font-serif text-black leading-relaxed">{project.goal}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Działania</h5>
                            <p className="font-serif text-black leading-relaxed">{project.actions}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Efekt</h5>
                            <p className="font-serif text-black leading-relaxed">{project.effect}</p>
                        </div>
                    </div>
                </div>

                {/* Footer — Cel / Działania / Efekt, desktop only */}
                <div className="hidden md:block shrink-0 border-t-2 border-black bg-[#f0ede4]">
                    <div className="grid grid-cols-3 gap-6 p-8 text-sm">
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Cel</h5>
                            <p className="font-serif text-black leading-relaxed">{project.goal}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Działania</h5>
                            <p className="font-serif text-black leading-relaxed">{project.actions}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Efekt</h5>
                            <p className="font-serif text-black leading-relaxed">{project.effect}</p>
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

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <>
            <section id="initiatives" className="py-20 w-full">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-20 uppercase tracking-wide border-b-4 border-black pb-4">
                    {siteData.projects.sectionLabel}
                </h2>

                <div className="flex flex-col pb-40">
                    {initiatives.map((project, index) => {
                        const isExpanded = expandedId === project.id;
                        const tabHeight = 80;
                        const topOffset = 100 + (index * tabHeight);

                        return (
                            <article
                                key={project.id}
                                className="group w-full transition-all duration-300 ease-in-out pt-10 pb-5 md:sticky"
                                style={{
                                    top: `${topOffset}px`,
                                    zIndex: index + 10
                                }}
                            >
                                {/* Folder Container */}
                                <div
                                    onClick={() => toggleExpand(project.id)}
                                    className={`
                                        relative w-full cursor-pointer
                                        bg-[#f7f5ef] text-black
                                        shadow-xl border-2 border-black
                                        transition-all duration-300
                                        ${isExpanded ? 'min-h-[500px]' : 'min-h-[120px] hover:translate-y-[-5px]'}
                                    `}
                                >
                                    {/* Tab (Top Left) */}
                                    <div className="absolute -top-12 -left-[2px] h-12 min-w-[140px] bg-[#f7f5ef] flex items-center justify-center px-6 border-t-2 border-l-2 border-r-2 border-black">
                                        <span className="font-mono text-xl font-bold tracking-widest text-black">
                                            #{String(project.id).padStart(2, '0')}
                                        </span>
                                        <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-[#f7f5ef] z-10"></div>
                                    </div>

                                    {/* Main Body Content */}
                                    <div className="p-6 md:p-10 flex flex-col gap-6">

                                        {/* Header Row */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black pb-6">
                                            <h3 className="text-2xl md:text-5xl font-serif font-bold leading-tight">
                                                {project.title}
                                            </h3>
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
                                                    <h4 className="font-sans text-sm uppercase tracking-widest text-gray-500 font-bold">Opis projektu</h4>
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
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Cel</h5>
                                                        <p className="font-serif text-black leading-relaxed">{project.goal}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Działania</h5>
                                                        <p className="font-serif text-black leading-relaxed">{project.actions}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Efekt</h5>
                                                        <p className="font-serif text-black leading-relaxed">{project.effect}</p>
                                                    </div>
                                                </div>

                                                {/* Expand Hint */}
                                                {!isExpanded && (
                                                    <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
                                                        <span>Kliknij, aby zobaczyć szczegóły</span>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
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
                <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
            )}
        </>
    );
}
