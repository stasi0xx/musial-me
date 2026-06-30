import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { desc, sql } from 'drizzle-orm';
import Link from 'next/link';
import AdminDeleteButton from '@/components/AdminDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      kicker: blogPosts.kicker,
      date: blogPosts.date,
      isPublished: blogPosts.isPublished,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .orderBy(sql`${blogPosts.date} DESC NULLS LAST`, desc(blogPosts.createdAt));

  return (
    <div>
      <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-black">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">Panel admina</p>
          <h1 className="font-serif text-4xl font-bold">Blog</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">{posts.length} wpisów w bazie</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="border-2 border-black bg-black text-white font-sans text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-3 hover:bg-white hover:text-black transition-colors"
        >
          + Nowy wpis
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center border border-black/10">
          <p className="font-serif text-2xl text-gray-400 mb-2">Brak wpisów</p>
          <p className="font-sans text-xs uppercase tracking-widest text-gray-300">
            Utwórz pierwszy wpis używając przycisku powyżej
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Tytuł</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 hidden md:table-cell">Kicker</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500 hidden lg:table-cell">Data</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-left pb-3 pr-6 text-gray-500">Status</th>
              <th className="font-sans text-[10px] uppercase tracking-[0.2em] text-right pb-3 text-gray-500">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-black/10 hover:bg-black/[0.02] group">
                <td className="py-4 pr-6">
                  <span className="font-serif font-bold text-sm leading-tight">{post.title}</span>
                </td>
                <td className="py-4 pr-6 hidden md:table-cell">
                  <span className="font-sans text-[11px] text-gray-500">{post.kicker}</span>
                </td>
                <td className="py-4 pr-6 hidden lg:table-cell">
                  <span className="font-mono text-[11px] text-gray-400">{post.date ?? '—'}</span>
                </td>
                <td className="py-4 pr-6">
                  <span className={`font-sans text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${
                    post.isPublished
                      ? 'border-black text-black'
                      : 'border-black/20 text-gray-400'
                  }`}>
                    {post.isPublished ? 'Pub.' : 'Szkic'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:underline underline-offset-4"
                    >
                      Edytuj
                    </Link>
                    <AdminDeleteButton id={post.id} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
