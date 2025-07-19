import { SearchBar } from "@/components/SearchBar"; // ✅ Corrected import path

export function HeroSection() {
  const handleSearch = (filters: any) => {
    const query = new URLSearchParams();

    if (filters.destination) query.set("destination", filters.destination.toString());
    if (filters.duration && filters.duration !== "any") query.set("duration", filters.duration.toString());
    if (filters.budget && filters.budget !== "any") query.set("budget", filters.budget.toString());

    window.location.href = `/packages?${query.toString()}`;
  };

  return (
    <section className="relative h-screen">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
                            url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div
          className="text-center max-w-4xl mx-auto px-4 w-full"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter drop-shadow-lg md:drop-shadow-xl">
            Discover Your <br />
            <span className="text-sunset-orange">Dream Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light drop-shadow">
            Explore Thailand, Dubai, Bali, Singapore, Maldives, Turkey & more
            amazing destinations from India
          </p>

          <div data-aos="fade-up" data-aos-delay="400" className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
