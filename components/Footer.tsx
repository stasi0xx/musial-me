import React from 'react';
import { siteData } from '../app/data';

export default function Footer() {
    const { footer } = siteData;
    return (
        <footer className="border-t border-black py-6 mt-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm uppercase tracking-widest font-bold gap-4 md:gap-0">
                <div className="hover:underline cursor-pointer">
                    {footer.left}
                </div>
                <div>
                    Page {footer.right}
                </div>
            </div>
        </footer>
    );
}
