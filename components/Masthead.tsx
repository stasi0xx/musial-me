import React from 'react';
import { siteData } from '../app/data';
import Link from 'next/link';

export default function Masthead() {
    return (
        <header className="border-b-2 border-black py-3 w-full mb-4 sticky top-0 bg-[#f7f5ef] z-50">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0 font-serif tracking-wider">
                <div className="text-xl font-black uppercase tracking-widest">
                    <Link href="/">{siteData.site.brand}</Link>
                </div>

                <nav className="flex gap-6 md:gap-8">
                    {siteData.site.navigation.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-xs md:text-sm uppercase tracking-[0.15em] font-medium hover:underline underline-offset-4"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="text-xs md:text-sm uppercase tracking-[0.15em] font-medium hidden md:block">
                    <a href={`mailto:${siteData.site.contact.email}`} className="hover:underline underline-offset-4">
                        {siteData.site.contact.email}
                    </a>
                </div>
            </div>
        </header>
    );
}
