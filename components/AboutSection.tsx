import Image from 'next/image';
import { db } from '@/lib/db';
import { aboutSection } from '@/lib/schema';

export const AboutSection = async () => {
    const [about] = await db.select().from(aboutSection).limit(1);

    const name = about?.name || 'Paweł Musiał';
    const role = about?.role || '';
    const image = about?.image || '';

    const paragraphs = (about?.bio || '')
        .split(/\n\n|\n/)
        .map(p => p.trim())
        .filter(Boolean);
    const leadParagraph = paragraphs[0] ?? '';
    const bodyParagraphs = paragraphs.slice(1);

    return (
        <section id="about" className="w-full py-20 scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t-4 border-black pt-12">
                {/* Left Column (7/12) - Text */}
                <div className="md:col-span-7 flex flex-col gap-8">
                    <header>
                        <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            O mnie
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
                            {name}{role ? ` — ${role}` : ''}
                        </h2>
                        {leadParagraph && (
                            <p className="text-2xl font-serif leading-relaxed italic text-gray-800">
                                {leadParagraph}
                            </p>
                        )}
                    </header>

                    {bodyParagraphs.length > 0 && (
                        <div className="prose prose-xl text-gray-900 font-serif leading-relaxed">
                            {bodyParagraphs.map((p, i) => (
                                <p key={i} className="text-2xl">{p}</p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column (5/12) - Profile Card */}
                <div className="md:col-span-5">
                    <div className="bg-gray-50 border-2 border-black p-8 flex flex-col items-center text-center sticky top-24">

                        <div className="w-40 h-40 rounded-full border-2 border-black bg-gray-200 mb-6 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-300 shadow-md">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold">
                                    [FOTO]
                                </div>
                            )}
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
