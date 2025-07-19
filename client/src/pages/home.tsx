import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/SearchBar"; // ✅ Import SearchBar
import { useState } from "react";
import { PackageType } from "@/types/package"; // Optional: depends on your types

export default function Home() {
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />

      {/* ✅ Search Bar Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <SearchBar
          onSearch={(results) => {
            setFilteredPackages(results);
            console.log("Filtered results:", results); // Optional debug
          }}
        />
      </div>

      {/* TODO: You can display filteredPackages here if needed */}

      <FeaturedDestinations />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
