'use client';

import { useState } from 'react';
import { siteData } from '../app/data';
import Link from 'next/link';

export default function Masthead() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-b-2 border-black w-full sticky top-0 bg-[#f7f5ef] z-50 md:px-8">
            <div className="flex flex-row justify-between items-center font-serif tracking-wider py-3 px-4 md:px-0">
                <div className="text-xl font-black uppercase tracking-widest">
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                        {siteData.site.brand}
                    </Link>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-8">
                    {siteData.site.navigation.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-sm uppercase tracking-[0.15em] font-medium hover:underline underline-offset-4"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="text-sm uppercase tracking-[0.15em] font-medium hidden md:block">
                    <a href={`mailto:${siteData.site.contact.email}`} className="hover:underline underline-offset-4">
                        {siteData.site.contact.email}
                    </a>
                </div>

                {/* Hamburger button */}
                <button
                    className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Otwórz menu"
                >
                    <span
                        className={`block h-[2px] w-6 bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                            }`}
                    />
                    <span
                        className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''
                            }`}
                    />
                    <span
                        className={`block h-[2px] w-6 bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                            }`}
                    />
                </button>
            </div>

            {/* Mobile dropdown menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <nav className="flex flex-col border-t-2 border-black font-serif">
                    {siteData.site.navigation.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm uppercase tracking-[0.15em] font-medium px-4 py-4 border-b border-black/20 hover:bg-black hover:text-[#f7f5ef] transition-colors duration-200"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
