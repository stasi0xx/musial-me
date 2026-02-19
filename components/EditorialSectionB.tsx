import Image from 'next/image';
import React from 'react';

export default function EditorialSectionB() {
    return (
        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full pb-12">
            {/* Left Column: Image (Desktop) - Reordered on Mobile */}
            <div className="md:col-span-5 order-2 md:order-1">
                <div className="relative aspect-[3/4] w-full border border-black p-1">
                    <div className="relative w-full h-full bg-neutral-200 grayscale contrast-[1.15]">
                        <Image
                            src="/images/editorial-2.jpg"
                            alt="Model posing in vintage attire"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-neutral-900/5 mix-blend-multiply pointer-events-none"></div>
                    </div>
                </div>
                <div className="mt-4">
                    <span className="block text-xs font-bold uppercase tracking-widest border-t border-black pt-2 w-full text-right text-gray-600">
                        Fig. 02 — Pose & Posture
                    </span>
                </div>
            </div>

            {/* Right Column: Text */}
            <div className="md:col-span-7 flex flex-col justify-center order-1 md:order-2">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                    Silhouette & Shadow
                </h2>
                <div className="prose prose-lg prose-headings:font-serif prose-p:font-serif text-black max-w-none">
                    <p className="text-xl leading-relaxed mb-6 font-serif">
                        The absence of color forces the eye to focus on texture and form. Silk becomes liquid light; velvet becomes a deep void. The interplay of fabric and skin is highlighted not by hue, but by the intensity of the illumination falling across the subject.
                    </p>
                    <div className="border-l-4 border-black pl-6 py-2 my-8 italic text-2xl">
                        "Photography is a reality so subtle that it becomes more real than reality."
                    </div>
                    <p className="text-xl leading-relaxed mb-6 font-serif">
                        This collection embodies that philosophy, stripping away the distraction of color to reveal the soul of the subject. Every fold of cloth and every angle of light tells a story of timeless elegance.
                    </p>
                    <p className="text-sm font-bold uppercase tracking-widest mt-12 text-right">
                        — By Eleanor Vance
                    </p>
                </div>
            </div>
        </article>
    );
}
