import SmoothScroll from './SmoothScroll';
import PaperLoader from './PaperLoader';
import Masthead from './Masthead';
import Footer from './Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <PaperLoader />
      <Masthead />
      {children}
      <Footer />
    </>
  );
}
