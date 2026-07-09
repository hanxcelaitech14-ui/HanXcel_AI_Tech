import Navbar from '@/components/public/Navbar';
import ParticleBackground from '@/components/public/ParticleBackground';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import WhyUs from '@/components/public/WhyUs';
import Statistics from '@/components/public/Statistics';
import Services from '@/components/public/Services';
import Solutions from '@/components/public/Solutions';
import Products from '@/components/public/Products';
import Process from '@/components/public/Process';
import Portfolio from '@/components/public/Portfolio';
import Testimonials from '@/components/public/Testimonials';
import Blog from '@/components/public/Blog';
import Company from '@/components/public/Company';
import FAQ from '@/components/public/FAQ';
import ProjectForm from '@/components/public/ProjectForm';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import Chatbot from '@/components/public/Chatbot';

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <Chatbot />
      <main>
        <Hero />
        <About />
        <WhyUs />
        <Statistics />
        <Services />
        <Solutions />
        <Products />
        <Process />
        <Portfolio />
        <Testimonials />
        <Blog />
        <Company />
        <FAQ />
        <ProjectForm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
