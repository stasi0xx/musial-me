'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Find the closest anchor element
            const link = target.closest('a') as HTMLAnchorElement;

            if (!link) return;

            // Ignore if open in new tab
            if (link.target === '_blank') return;

            // Get the href
            const href = link.getAttribute('href');
            if (!href) return;

            // Create a URL object
            let url: URL;
            try {
                url = new URL(link.href);
            } catch (err) {
                return;
            }

            // Check if same origin, same path, and has hash
            if (
                url.origin === window.location.origin &&
                url.pathname === window.location.pathname &&
                url.hash
            ) {
                // Prevent default navigation (Next.js Link or browser jump)
                e.preventDefault();
                e.stopPropagation(); // Stop others from handling it

                const id = url.hash.substring(1);
                const element = document.getElementById(id);

                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL hash manually
                    window.history.pushState(null, '', url.hash);
                }
            }
        };

        // Use capture phase to intercept before Next.js Link
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, []);

    return null;
}
