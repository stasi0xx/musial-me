import React from 'react';
import { siteData } from '../app/data';
import Link from 'next/link';

export default function EditorialColumns() {
    const { editorialColumns } = siteData;

    return (
        <section className="w-full pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {editorialColumns.map((col, index) => (
                    <article key={index} className={`flex flex-col ${index > 0 ? 'pt-8 md:pt-0 md:pl-8 lg:pl-12' : ''}`}>
                        <header className="mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-4 w-max">
                                {col.sectionLabel}
                            </h4>
                            <h3 className="font-serif text-lg font-bold leading-tight mb-2">
                                {col.headline}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {col.lead}
                            </p>
                        </header>

                        <div className="flex flex-col gap-6 mt-auto">
                            {col.items.map((item: any, i) => (
                                <Link href={item.href} key={i} className="group block">
                                    <h5 className="font-bold text-sm mb-1 group-hover:underline decoration-1 underline-offset-2">
                                        {item.title}
                                    </h5>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-1">
                                        {item.excerpt}
                                    </p>
                                    {item.date && (
                                        <time className="text-[10px] text-gray-400 uppercase tracking-wider">
                                            {item.date}
                                        </time>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
