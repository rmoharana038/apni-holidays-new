import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { getPackages } from "@/lib/firebase";
import { Link } from "wouter";

export function FeaturedDestinations() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesData = await getPackages();
        setPackages(packagesData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Featured Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our most popular travel packages</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Featured International Destinations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore amazing international destinations from India with our curated travel packages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="group transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="relative">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Darker gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span className="text-white font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-200 mb-3">{pkg.duration} Days – {pkg.destination}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white">
                      <span className="text-lg font-bold">₹{parseInt(pkg.price).toLocaleString()}</span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-300 line-through ml-2">
                          ₹{parseInt(pkg.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {pkg.discount && (
                      <Badge className="tropical-green text-white">{pkg.discount}</Badge>
                    )}
                  </div>
                  <Link href={`/package/${pkg.id}`}>
                    <Button className="mt-2 w-full travel-blue text-white">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/packages">
            <Button className="travel-blue text-white px-8 py-3 text-lg font-semibold">
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
