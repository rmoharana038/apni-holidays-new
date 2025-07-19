// client/src/components/ui/search-bar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";

export function SearchBar() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");

  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setPackages(data);
    };
    fetchPackages();
  }, []);

  const getUniqueValues = (key: string) => {
    return [...new Set(packages.map((pkg) => pkg[key]).filter(Boolean))];
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (country) params.append("country", country);
    if (duration) params.append("duration", duration);
    if (budget) params.append("budget", budget);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 justify-center items-center mt-6 mx-4 md:mx-16">
      <Select onValueChange={setDestination}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("destination").map((value) => (
            <SelectItem key={value} value={value}>{value}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setCountry}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("country").map((value) => (
            <SelectItem key={value} value={value}>{value}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setDuration}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Duration (days)" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("duration").map((value) => (
            <SelectItem key={value} value={value.toString()}>{value} days</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Budget (INR)"
        type="number"
        className="w-full md:w-48"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <Button onClick={handleSearch} className="w-full md:w-auto">
        Search
      </Button>
    </div>
  );
}
