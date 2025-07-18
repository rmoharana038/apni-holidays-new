import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { getPackages } from "@/lib/firebase";
import { Link } from "wouter";

export function FeaturedDestinations() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesData = await getPackages();
        setPackages(packagesData.slice(0, 6)); // Show only first 6 packages
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const defaultPackages = [
    {
      id: 'thailand',
      title: 'Thailand Explorer',
      destination: 'Bangkok & Phuket',
      country: 'Thailand',
      duration: 5,
      price: '45000',
      originalPrice: '55000',
      rating: '4.8',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '18% OFF'
    },
    {
      id: 'dubai',
      title: 'Dubai Explorer',
      destination: 'City of Gold',
      country: 'UAE',
      duration: 4,
      price: '65000',
      originalPrice: '78000',
      rating: '4.9',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '17% OFF'
    },
    {
      id: 'bali',
      title: 'Bali Adventure',
      destination: 'Island Paradise',
      country: 'Indonesia',
      duration: 6,
      price: '52000',
      originalPrice: '60000',
      rating: '4.7',
      imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '13% OFF'
    },
    {
      id: 'singapore',
      title: 'Singapore Highlights',
      destination: 'Lion City',
      country: 'Singapore',
      duration: 4,
      price: '58000',
      originalPrice: '68000',
      rating: '4.8',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '15% OFF'
    },
    {
      id: 'kerala',
      title: 'God\'s Own Country',
      destination: 'Backwaters & Hills',
      country: 'India',
      duration: 5,
      price: '25000',
      originalPrice: '30000',
      rating: '4.6',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '17% OFF'
    },
    {
      id: 'rajasthan',
      title: 'Royal Rajasthan',
      destination: 'Land of Kings',
      country: 'India',
      duration: 7,
      price: '35000',
      originalPrice: '42000',
      rating: '4.7',
      imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      discount: '17% OFF'
    }
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Featured Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our most popular international and domestic travel packages</p>
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover amazing international destinations from India with our carefully curated travel packages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPackages.map((pkg) => (
            <Card key={pkg.id} className="group cursor-pointer transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{pkg.country}</h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span className="text-white font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-200 mb-3">{pkg.duration} Days {pkg.destination}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-lg font-bold">₹{parseInt(pkg.price).toLocaleString()}</span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-300 line-through ml-2">
                          ₹{parseInt(pkg.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {pkg.discount && (
                      <Badge className="tropical-green text-white">
                        {pkg.discount}
                      </Badge>
                    )}
                  </div>
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
