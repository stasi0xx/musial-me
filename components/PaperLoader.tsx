'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PaperLoader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Prevent scrolling when loader is active
        document.body.style.overflow = 'hidden';

        // Simulate minimum load time + window load
        const handleLoad = () => {
            setTimeout(() => {
                setIsLoaded(true);
            }, 1000); // Minimum 1s visibility
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    useGSAP(() => {
        if (!isLoaded || !containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                if (containerRef.current) {
                    containerRef.current.style.display = 'none';
                }
                // Re-enable scrolling
                document.body.style.overflow = '';
            }
        });

        // Animate the text out first
        tl.to('.loader-text', {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power2.in'
        });

        // Animate the curtain up
        tl.to(containerRef.current, {
            yPercent: -150,
            duration: 1.5,
            ease: 'power4.inOut',
            delay: 0.1
        });

    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1d1d1b] text-[#f7f5ef]"
        >
            {/* Texture Overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />

            <div className="loader-text flex flex-col items-center">
                <h1 className="font-serif text-4xl md:text-6xl italic font-bold tracking-tight mb-4">
                    Musial.me
                </h1>
                <div className="w-12 h-[1px] bg-[#f7f5ef] opacity-50"></div>
            </div>

            {/* Torn edge SVG at the bottom */}
            <div className="absolute bottom-0 left-0 w-full translate-y-[99%] text-[#1d1d1b]">
                <svg
                    viewBox="0 0 1440 100"
                    fill="currentColor"
                    preserveAspectRatio="none"
                    className="w-full h-[50px] md:h-[80px] lg:h-[100px]"
                >
                    <path d="M0,0 C240,80 480,20 720,60 C960,100 1200,40 1440,80 V0 H0 Z" transform="scale(1, -1) translate(0, -100)" />
                    {/* A more complex jagged path to simulate torn paper */}
                    <path d="M0,0 L0,40 
                     L15,50 L30,42 L45,55 L60,45 
                     L75,58 L90,48 L105,60 L120,50 
                     L135,62 L150,52 L165,65 L180,55 
                     L195,68 L210,58 L225,70 L240,60 
                     L255,72 L270,62 L285,75 L300,65
                     L315,78 L330,68 L345,80 L360,70
                     L375,82 L390,72 L405,85 L420,75
                     L435,88 L450,78 L465,90 L480,80
                     L495,92 L510,82 L525,95 L540,85
                     L555,98 L570,88 L585,100 L600,90
                     L615,98 L630,88 L645,95 L660,85
                     L675,92 L690,82 L705,90 L720,80
                     L735,88 L750,78 L765,85 L780,75
                     L795,82 L810,72 L825,80 L840,70
                     L855,78 L870,68 L885,75 L900,65
                     L915,72 L930,62 L945,70 L960,60
                     L975,68 L990,58 L1005,65 L1020,55
                     L1035,62 L1050,52 L1065,60 L1080,50
                     L1095,58 L1110,48 L1125,55 L1140,45
                     L1155,52 L1170,42 L1185,50 L1200,40
                     L1215,48 L1230,38 L1245,45 L1260,35
                     L1275,42 L1290,32 L1305,40 L1320,30
                     L1335,38 L1350,28 L1365,35 L1380,25
                     L1395,32 L1410,22 L1425,30 L1440,20
                     L1440,0 Z"
                        transform="scale(1, 1)"
                    />
                </svg>
            </div>
        </div>
    );
}
