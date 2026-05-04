import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-serif font-bold text-xl leading-none">
              musial.me <span className="text-gray-400 font-sans font-normal text-sm">/ admin</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/admin/blog"
                className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4"
              >
                Blog
              </Link>
              <Link
                href="/admin/initiatives"
                className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4"
              >
                Inicjatywy
              </Link>
              <Link
                href="/admin/about"
                className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4"
              >
                O mnie
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
            >
              ← Wróć na stronę
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
