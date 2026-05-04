import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import ProjectsStack from '../components/ProjectsStack';
import BlogSection from '../components/BlogSection';
import { AboutSection } from '../components/AboutSection';
import EditorialColumns from '../components/EditorialColumns';
import ContactSection from '../components/ContactSection';
import PublicShell from '../components/PublicShell';
import { db } from '@/lib/db';
import { blogPosts, initiatives } from '@/lib/schema';
import { eq, and, asc, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [initiativesList, featuredPosts, homeBlogPosts] = await Promise.all([
        db.select().from(initiatives)
            .where(eq(initiatives.isActive, true))
            .orderBy(asc(initiatives.sortOrder)),
        db.select().from(blogPosts)
            .where(and(eq(blogPosts.isFeatured, true), eq(blogPosts.isPublished, true))),
        db.select().from(blogPosts)
            .where(and(eq(blogPosts.showInBlogSection, true), eq(blogPosts.isPublished, true)))
            .orderBy(desc(blogPosts.date))
            .limit(3),
    ]);

    return (
        <PublicShell>
            <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
                <Hero />
                <FeaturedSection posts={featuredPosts} />
                <ProjectsStack initiatives={initiativesList} />
                <BlogSection posts={homeBlogPosts} />
                <AboutSection />
                <ContactSection />
            </main>
        </PublicShell>
    );
}
