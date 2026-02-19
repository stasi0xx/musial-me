import Masthead from '../components/Masthead';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import ProjectsStack from '../components/ProjectsStack';
import BlogSection from '../components/BlogSection';
import { AboutSection } from '../components/AboutSection';
import EditorialColumns from '../components/EditorialColumns';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <Masthead />
            <Hero />
            <FeaturedSection />
            <ProjectsStack />
            <BlogSection />
            <AboutSection />
            <ContactSection />
            <Footer />
        </main>
    );
}
