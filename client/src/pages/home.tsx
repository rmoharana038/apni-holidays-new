import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  const handleSearch = (filters: any) => {
    const query = new URLSearchParams();

    if (filters.destination) query.set("destination", filters.destination.toString());
    if (filters.duration && filters.duration !== "any") query.set("duration", filters.duration.toString());
    if (filters.budget && filters.budget !== "any") query.set("budget", filters.budget.toString());

    // Redirect using window.location
    window.location.href = `/packages?${query.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />

      {/* Search Bar Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <FeaturedDestinations />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
