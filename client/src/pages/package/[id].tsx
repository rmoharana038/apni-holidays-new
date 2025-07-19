import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function PackageDetails() {
  const params = useParams();
  const { id } = params;

  const [pkg, setPkg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const docRef = doc(db, "packages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPkg({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPkg(null);
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white"><Navigation /><div className="text-center py-20 text-gray-500 text-xl">Loading...</div><Footer /></div>;
  }

  if (!pkg) {
    return <div className="min-h-screen bg-white"><Navigation /><div className="text-center py-20 text-gray-500 text-xl">Package not found.</div><Footer /></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-96 object-cover rounded-xl mb-8" />

        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-inter">{pkg.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <Badge>{pkg.country}</Badge>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.destination}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration} Days</span>
          <span className="flex items-center gap-1 text-yellow-500"><Star className="h-4 w-4 fill-current" /> {pkg.rating}</span>
        </div>

        <p className="text-lg text-gray-700 mb-6">{pkg.description}</p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Itinerary</h2>
          <ul className="list-disc list-inside text-gray-700">
            {pkg.itinerary?.map((day: string, i: number) => (
              <li key={i}>{day}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Inclusions</h2>
            <ul className="space-y-1">
              {pkg.inclusions?.map((inc: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" /> {inc}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Exclusions</h2>
            <ul className="space-y-1">
              {pkg.exclusions?.map((exc: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" /> {exc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between py-6 border-t border-b mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{parseInt(pkg.price).toLocaleString()}
              {pkg.originalPrice && (
                <span className="text-base text-gray-400 line-through ml-3">
                  ₹{parseInt(pkg.originalPrice).toLocaleString()}
                </span>
              )}
            </p>
          </div>

          <a
            href={`https://wa.me/919179084999?text=${encodeURIComponent(`Hi I want to know more about ${pkg.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="travel-blue text-white px-6 py-3 text-lg">
              Enquiry on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
