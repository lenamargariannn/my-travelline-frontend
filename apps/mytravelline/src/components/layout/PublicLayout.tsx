import { Outlet } from 'react-router-dom';
import { LanguageTransitionProvider } from '@/context/LanguageTransitionContext';
import PageBackground from '@/components/PageBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollToTop from '@/components/ScrollToTop';

export default function PublicLayout() {
  return (
    <LanguageTransitionProvider>
      <PageBackground />
      <Navbar />
      <ScrollToTop />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
    </LanguageTransitionProvider>
  );
}
