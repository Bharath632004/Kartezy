"use client';
import HeroSectionWithSearch from '@/client-components/home/HeroSectionWithSearch';
import FeaturesSection from '@/client-components/home/FeaturesSection';
import HowItWorksSection from '@/client-components/home/HowItWorksSection';
import CategoriesSection from '@/client-components/home/CategoriesSection';
import DownloadAppSection from '@/client-components/home/DownloadAppSection';
import TestimonialsSection from '@/client-components/home/TestimonialsSection';
import CitiesSection from '@/client-components/home/CitiesSection';
import BrandsSection from '@/client-components/home/BrandsSection';
import FAQSection from '@/client-components/home/FAQSection';
import NewsletterSection from '@/client-components/home/NewsletterSection';

export default function Home() {
  return (
    <main>
      <HeroSectionWithSearch />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection />
      <DownloadAppSection />
      <TestimonialsSection />
      <CitiesSection />
      <BrandsSection />
      <FAQSection />
      <NewsletterSection />
    </main>
  );
}
