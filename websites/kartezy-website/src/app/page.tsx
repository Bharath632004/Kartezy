import { useQuery } from '@tanstack/react-query';
import {
  getHeroData,
  getFeaturesData,
  getHowItWorksData,
  getCategoriesData,
  getDownloadAppData,
  getTestimonialsData,
  getCitiesData,
  getBrandsData,
  getFAQData,
  getNewsletterData,
} from '@/lib/homeServices';
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
  // Fetch all sections data in parallel
  const {
    data: heroData,
    isLoading: heroLoading,
  } = useQuery({
    queryKey: ['hero'],
    queryFn: getHeroData,
  });

  const {
    data: featuresData,
    isLoading: featuresLoading,
  } = useQuery({
    queryKey: ['features'],
    queryFn: getFeaturesData,
  });

  const {
    data: howItWorksData,
    isLoading: howItWorksLoading,
  } = useQuery({
    queryKey: ['how-it-works'],
    queryFn: getHowItWorksData,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesData,
  });

  const {
    data: downloadAppData,
    isLoading: downloadAppLoading,
  } = useQuery({
    queryKey: ['download-app'],
    queryFn: getDownloadAppData,
  });

  const {
    data: testimonialsData,
    isLoading: testimonialsLoading,
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonialsData,
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
  } = useQuery({
    queryKey: ['cities'],
    queryFn: getCitiesData,
  });

  const {
    data: brandsData,
    isLoading: brandsLoading,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrandsData,
  });

  const {
    data: faqData,
    isLoading: faqLoading,
  } = useQuery({
    queryKey: ['faq'],
    queryFn: getFAQData,
  });

  const {
    data: newsletterData,
    isLoading: newsletterLoading,
  } = useQuery({
    queryKey: ['newsletter'],
    queryFn: getNewsletterData,
  });

  // Show loading state if any data is loading
  const isLoading =
    heroLoading ||
    featuresLoading ||
    howItWorksLoading ||
    categoriesLoading ||
    downloadAppLoading ||
    testimonialsLoading ||
    citiesLoading ||
    brandsLoading ||
    faqLoading ||
    newsletterLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <HeroSectionWithSearch data={heroData} />
      <FeaturesSection data={featuresData} />
      <HowItWorksSection data={howItWorksData} />
      <CategoriesSection data={categoriesData} />
      <DownloadAppSection data={downloadAppData} />
      <TestimonialsSection data={testimonialsData} />
      <CitiesSection data={citiesData} />
      <BrandsSection data={brandsData} />
      <FAQSection data={faqData} />
      <NewsletterSection data={newsletterData} />
    </main>
  );
}