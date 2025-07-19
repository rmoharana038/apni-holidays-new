import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Clock, Users, Search } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Packages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Manually extract query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("destination") || "";
    const duration = params.get("duration") || "all";
    const budget = params.get("budget") || "all";

    setSearchTerm(destination);
    setDurationFilter(duration);
    setPriceFilter(budget);
  }, []);

  useEffect(() => {
    setLoading(true);
    const packagesRef = collection(db, "packages");
    const q = query(packagesRef, where("isActive", "==", true), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPackages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...packages];

    if (searchTerm) {
      filtered = filtered.filter((pkg) =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.country === countryFilter);
    }

    if (durationFilter !== "all") {
      filtered = filtered.filter((pkg) => {
        const duration = parseInt(pkg.duration);
        if (durationFilter === "3-5") return duration >= 3 && duration <= 5;
        if (durationFilter === "6-10") return duration >= 6 && duration <= 10;
        if (durationFilter === "10+") return duration > 10;
        return true;
      });
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter((pkg) => {
        const price = parseInt(pkg.price);
        if (priceFilter === "under-50k") return price <= 50000;
        if (priceFilter === "50k-100k") return price > 50000 && price <= 100000;
        if (priceFilter === "100k+") return price > 100000;
        return true;
      });
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, countryFilter, durationFilter, priceFilter]);

  const countries = [...new Set(packages.map((pkg) => pkg.country))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12 text-center" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Holiday Packages</h1>
          <p className="text-xl text-gray-600">Discover amazing destinations around the world</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-aos="zoom-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="3-5">3-5 Days</SelectItem>
                <SelectItem value="6-10">6-10 Days</SelectItem>
                <SelectItem value="10+">10+ Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                <SelectItem value="100k+">₹1,00,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6" data-aos="fade-up">
          <p className="text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className="group overflow-hidden hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-gray-800">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                    {pkg.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{pkg.title}</CardTitle>
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{pkg.destination}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{pkg.country}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>For All Ages</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{parseInt(pkg.price).toLocaleString()}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ₹{parseInt(pkg.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <a href={`/package/${pkg.id}`}>
                      <Button className="travel-blue text-white">View Details</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12" data-aos="fade-in">
            <p className="text-gray-500 text-lg">No packages found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCountryFilter("all");
                setDurationFilter("all");
                setPriceFilter("all");
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
