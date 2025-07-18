import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, IndianRupee, Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (filters: any) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const filters = {
      destination: formData.get('destination'),
      duration: formData.get('duration'),
      budget: formData.get('budget'),
    };
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="destination"
                placeholder="Where to?"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select name="duration">
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Any Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Duration</SelectItem>
                  <SelectItem value="3-5">3-5 Days</SelectItem>
                  <SelectItem value="6-10">6-10 Days</SelectItem>
                  <SelectItem value="10+">10+ Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Budget</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select name="budget">
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Budget</SelectItem>
                  <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                  <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100k+">₹1,00,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="travel-blue text-white px-8 py-3 text-lg font-semibold">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
