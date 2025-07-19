import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />

      {/* ✅ Removed duplicate SearchBar from here */}

      <FeaturedDestinations />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
