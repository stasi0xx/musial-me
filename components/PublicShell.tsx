import SmoothScroll from './SmoothScroll';
import Masthead from './Masthead';
import Footer from './Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Masthead />
      {children}
      <Footer />
    </>
  );
}
