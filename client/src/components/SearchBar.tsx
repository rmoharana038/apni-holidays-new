import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";

export function SearchBar() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("all");
  const [country, setCountry] = useState("all");
  const [duration, setDuration] = useState("all");
  const [budget, setBudget] = useState("all");

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
    if (destination !== "all") params.append("destination", destination);
    if (country !== "all") params.append("country", country);
    if (duration !== "all") params.append("duration", duration);
    if (budget !== "all") params.append("budget", budget);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 justify-center items-center mt-6 mx-4 md:mx-16">
      <Select value={destination} onValueChange={setDestination}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Destinations</SelectItem>
          {getUniqueValues("destination").map((value) => (
            <SelectItem key={value} value={value}>{value}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {getUniqueValues("country").map((value) => (
            <SelectItem key={value} value={value}>{value}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={duration} onValueChange={setDuration}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Duration (days)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Duration</SelectItem>
          {getUniqueValues("duration").map((value) => (
            <SelectItem key={value} value={value.toString()}>{value} days</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={budget} onValueChange={setBudget}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Budget" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Budget</SelectItem>
          <SelectItem value="budget">Under ₹30,000</SelectItem>
          <SelectItem value="mid">₹30,000 - ₹70,000</SelectItem>
          <SelectItem value="luxury">₹70,000+</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} className="w-full md:w-auto">
        Search
      </Button>
    </div>
  );
}
