import { Card, CardContent } from "@/components/ui/card";
import { Plane, Headphones, Shield, MapPin, Heart, Smartphone } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Plane,
      title: "Best Price Guarantee",
      description: "We offer competitive prices with no hidden fees. If you find a better deal, we'll match it!",
      color: "travel-blue"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our dedicated travel experts are available round the clock to assist you during your journey.",
      color: "sunset-orange"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your safety is our priority. All our packages include comprehensive travel insurance.",
      color: "tropical-green"
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: "Our local guides know the best spots and hidden gems to make your trip unforgettable.",
      color: "travel-blue"
    },
    {
      icon: Heart,
      title: "Personalized Service",
      description: "Every package is tailored to your preferences, ensuring a unique and memorable experience.",
      color: "sunset-orange"
    },
    {
      icon: Smartphone,
      title: "Easy Booking",
      description: "Book your dream vacation in just a few clicks with our user-friendly platform.",
      color: "tropical-green"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Why Choose Apni Holidays?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We make your dream vacation a reality with our expertise and personalized service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  feature.color === 'travel-blue' ? 'bg-[var(--travel-blue)]' :
                  feature.color === 'sunset-orange' ? 'bg-[var(--sunset-orange)]' :
                  'bg-[var(--tropical-green)]'
                }`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
