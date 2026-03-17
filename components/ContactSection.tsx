import React from 'react';
import { siteData } from '../app/data';

export default function ContactSection() {
    const { contactSection } = siteData;

    return (
        <section id={contactSection.id} className="w-full border-t-2 border-black py-16">
            <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block text-xs font-bold uppercase tracking-widest border border-black px-3 py-1 mb-6 rounded-full bg-white">
                    {contactSection.sectionLabel}
                </span>

                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                    {contactSection.headline}
                </h2>

                <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto leading-relaxed">
                    {contactSection.text}
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10">
                    <a href={`mailto:${contactSection.contact.email}`} className="flex flex-col items-center group">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 group-hover:text-black transition-colors">Email</span>
                        <span className="font-serif text-2xl md:text-3xl border-b-2 border-transparent group-hover:border-black transition-all">
                            {contactSection.contact.email}
                        </span>
                    </a>

                    <div className="hidden md:block w-[1px] h-12 bg-gray-300"></div>

                    <a href={`tel:${contactSection.contact.phone.replace(/\s/g, '')}`} className="flex flex-col items-center group">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 group-hover:text-black transition-colors">Telefon</span>
                        <span className="font-serif text-2xl md:text-3xl border-b-2 border-transparent group-hover:border-black transition-all">
                            {contactSection.contact.phone}
                        </span>
                    </a>
                </div>

                <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    {contactSection.microcopy}
                </p>
            </div>
        </section>
    );
}
