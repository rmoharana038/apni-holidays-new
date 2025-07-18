import { SearchBar } from "@/components/ui/search-bar";

export function HeroSection() {
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // TODO: Implement search functionality
  };

  return (
    <section className="relative h-screen">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
            Discover Your <br />
            <span className="text-sunset-orange">Dream Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
            Explore Thailand, Dubai, Bali, Singapore, Maldives, Turkey & more amazing destinations from India
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
}
