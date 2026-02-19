import React from 'react';

export const AboutSection = () => {
    return (
        <section id="about" className="w-full max-w-6xl mx-auto py-20 px-4 sm:px-6 scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t-4 border-black pt-12">
                {/* Left Column (7/12) - Text Only */}
                <div className="md:col-span-7 flex flex-col gap-8">
                    <header>
                        <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            O mnie
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
                            Paweł Musiał — marketingowiec i rowerzysta
                        </h2>
                        <p className="text-2xl font-serif leading-relaxed italic text-gray-800">
                            Od ponad 20 lat pracuję w marketingu — projektuję, tworzę i oceniam komunikację marek.
                        </p>
                    </header>

                    <div className="prose prose-xl text-gray-900 font-serif leading-relaxed">
                        <p className='text-2xl'>
                            Równolegle od lat działam społecznie w tematach miasta i dzielnicy. Interesuje mnie to, co w praktyce działa: dobre decyzje, mądre procesy i uczciwy dialog.
                        </p>
                        <p className='text-2xl'>
                            Na musial.me zapisuję obserwacje z pracy, działania lokalne oraz rowerową codzienność i wydarzenia — możliwie konkretnie, bez nadęcia.
                        </p>
                    </div>
                </div>

                {/* Right Column (5/12) - Profile Card with Round Photo */}
                <div className="md:col-span-5">
                    <div className="bg-gray-50 border-2 border-black p-8 flex flex-col items-center text-center sticky top-24">

                        {/* Round Photo */}
                        <div className="w-40 h-40 rounded-full border-2 border-black bg-gray-200 mb-6 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-300 shadow-md">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold">
                                [FOTO]
                            </div>
                            {/* <img src="/images/pawel-portrait.jpg" alt="Paweł Musiał" className="w-full h-full object-cover" /> */}
                        </div>

                        <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-6 border-b border-black pb-2 inline-block">
                            W skrócie
                        </h3>

                        <ul className="space-y-3 font-sans text-sm md:text-base mb-8 text-left w-full pl-4">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-black min-w-[10px]">•</span>
                                <span>20+ lat w marketingu</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-black min-w-[10px]">•</span>
                                <span>Działania społeczne: miasto i dzielnica</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-black min-w-[10px]">•</span>
                                <span>Rower: codzienność, wydarzenia, trasy</span>
                            </li>
                        </ul>

                        <div className="w-full pt-6 border-t border-gray-300">
                            <p className="font-sans text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Baza kontaktu
                            </p>
                            <a
                                href="mailto:pawel@musial.me"
                                className="font-serif text-xl font-bold underline decoration-1 underline-offset-4 hover:bg-black hover:text-white transition-colors"
                            >
                                pawel@musial.me
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
