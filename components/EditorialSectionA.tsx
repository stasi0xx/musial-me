import Image from 'next/image';
import React from 'react';

export default function EditorialSectionA() {
    return (
        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full border-b border-black pb-12">
            {/* Left Column: Text */}
            <div className="md:col-span-4 flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        The Lens of Time
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 text-justify sm:text-left">
                        In an era of digital perfection, the raw, unfiltered grain of black and white photography brings us back to the roots of emotion. Shadows speak louder than light, and composition becomes the narrative voice that guides the viewer through the frame.
                    </p>
                    <p className="text-lg leading-relaxed text-justify sm:text-left">
                        We explore the archives of the mid-20th century to discover how pioneers of fashion photography shaped the way we perceive elegance today, using nothing but contrast and form.
                    </p>
                </div>
                <div className="mt-8 md:mt-0">
                    <span className="block text-xs font-bold uppercase tracking-widest border-t border-black pt-2 w-max text-gray-600">
                        Fig. 01 — The Studio
                    </span>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="md:col-span-8">
                <div className="relative aspect-[4/3] w-full border border-black p-1">
                    <div className="relative w-full h-full bg-neutral-200 grayscale contrast-[1.15]">
                        {/* Using a placeholder or local path. ensure image exists or use next-placeholder */}
                        <Image
                            src="/images/editorial-1.jpg"
                            alt="Fashion editorial shot in studio"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                        <div className="absolute inset-0 bg-neutral-900/5 mix-blend-multiply pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </article>
    );
}
