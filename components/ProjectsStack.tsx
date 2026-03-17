'use client';

import React, { useState } from 'react';
import { siteData } from '@/app/data';
import Link from 'next/link';

export default function ProjectsStack() {
    // Only one expanded at a time
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section id="initiatives" className="py-20 w-full">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-20 uppercase tracking-wide border-b-4 border-black pb-4">
                {siteData.projects.sectionLabel}
            </h2>

            <div className="flex flex-col pb-40">
                {siteData.projects.items.map((project, index) => {
                    const isExpanded = expandedId === project.id;
                    // Stacking logic: 
                    // To act like physical folders, they need a staggered top offset.
                    // The "sticky" top keeps them pinned as you scroll.
                    // Tab height is roughly 40-50px.
                    const tabHeight = 80; // Increased spacing
                    // Increase spacing slightly.
                    const topOffset = 100 + (index * tabHeight);

                    return (
                        <article
                            key={project.id}
                            className="group sticky w-full transition-all duration-300 ease-in-out pt-10 pb-5"
                            style={{
                                top: `${topOffset}px`,
                                zIndex: index + 10
                            }}
                        >
                            {/* Folder Container - The Shape */}
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
                                {/* THE TAB (Top Left) */}
                                <div className="absolute -top-12 -left-[2px] h-12 min-w-[140px] bg-[#f7f5ef] flex items-center justify-center px-6 border-t-2 border-l-2 border-r-2 border-black">
                                    <span className="font-mono text-xl font-bold tracking-widest text-black">#{project.id}</span>
                                    {/* Cover bottom border of tab to merge with body */}
                                    <div className="absolute bottom-[-2px] left-0 w-full h-[4px] bg-[#f7f5ef] z-10"></div>
                                </div>

                                {/* Main Body Content */}
                                <div className="p-6 md:p-10 flex flex-col gap-6">

                                    {/* Header Row: Title & Meta */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black pb-6">
                                        <h3 className="text-2xl md:text-5xl font-serif font-bold leading-tight">
                                            {project.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-widest text-gray-600">
                                            <span className="border border-black px-2 py-1">{project.meta.type}</span>
                                            <span className="border border-black px-2 py-1">{project.meta.year}</span>
                                            <span className="border border-black px-2 py-1 bg-black text-white font-bold">{project.meta.category}</span>
                                        </div>
                                    </div>

                                    {/* Content Grid */}
                                    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-100'}`}>

                                        {/* Left: Image Placeholder */}
                                        <div className="md:col-span-4 aspect-video md:aspect-[4/3] bg-gray-200 border border-black overflow-hidden relative group-hover:bg-gray-300 transition-colors">
                                            {/* Simulated Image Placeholder */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-2 opacity-30">
                                                    <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                                                    <div className="w-20 h-2 bg-gray-400 rounded"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Description & Details */}
                                        <div className="md:col-span-8 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <h4 className="font-sans text-sm uppercase tracking-widest text-gray-500 font-bold">Opis projektu</h4>
                                                <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800">
                                                    {project.description}
                                                </p>
                                            </div>

                                            {/* Expanded Content: Accordion/Details */}
                                            <div
                                                className={`
                                                    mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm
                                                    overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-in-out
                                                    ${isExpanded ? 'max-h-[500px] opacity-100 pt-8 border-t border-black' : 'max-h-0 opacity-0 mt-0'}
                                                `}
                                            >
                                                <div className="space-y-2">
                                                    <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Cel</h5>
                                                    <p className="font-serif text-black leading-relaxed">{project.details.goal}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Działania</h5>
                                                    <p className="font-serif text-black leading-relaxed">{project.details.actions}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">Efekt</h5>
                                                    <p className="font-serif text-black leading-relaxed">{project.details.effect}</p>
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
    );
}
