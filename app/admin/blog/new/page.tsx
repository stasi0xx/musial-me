import Link from 'next/link';
import AdminBlogForm from '@/components/AdminBlogForm';

export default function AdminBlogNewPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/10">
        <Link
          href="/admin/blog"
          className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          ← Blog
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="font-serif text-2xl font-bold">Nowy wpis</h1>
      </div>
      <AdminBlogForm />
    </div>
  );
}
