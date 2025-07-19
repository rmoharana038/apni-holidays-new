// File: src/components/search-bar.tsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Adjust based on your path

export default function SearchBar({ onSearch }: { onSearch: (results: any[]) => void }) {
  const [packages, setPackages] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    destination: "",
    country: "",
    duration: "",
    budget: "",
  });

  useEffect(() => {
    const fetchPackages = async () => {
      const snapshot = await getDocs(collection(db, "packages"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPackages(data);
      setFiltered(data);
    };
    fetchPackages();
  }, []);

  const unique = (key: string) => [...new Set(packages.map(pkg => pkg[key]))];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const result = packages.filter(pkg => {
      return (!newFilters.destination || pkg.destination === newFilters.destination) &&
             (!newFilters.country || pkg.country === newFilters.country) &&
             (!newFilters.duration || String(pkg.duration) === newFilters.duration) &&
             (!newFilters.budget || Number(pkg.price) <= Number(newFilters.budget));
    });

    setFiltered(result);
    onSearch(result);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-center justify-between">
      <select name="destination" value={filters.destination} onChange={handleChange} className="border rounded p-2 w-40">
        <option value="">Destination</option>
        {unique("destination").map(val => <option key={val} value={val}>{val}</option>)}
      </select>
      <select name="country" value={filters.country} onChange={handleChange} className="border rounded p-2 w-40">
        <option value="">Country</option>
        {unique("country").map(val => <option key={val} value={val}>{val}</option>)}
      </select>
      <select name="duration" value={filters.duration} onChange={handleChange} className="border rounded p-2 w-40">
        <option value="">Duration (days)</option>
        {unique("duration").map(val => <option key={val} value={val}>{val}</option>)}
      </select>
      <select name="budget" value={filters.budget} onChange={handleChange} className="border rounded p-2 w-40">
        <option value="">Max Budget</option>
        {[10000, 20000, 30000, 40000, 50000].map(val => <option key={val} value={val}>{`Up to ₹${val}`}</option>)}
      </select>
    </div>
  );
}